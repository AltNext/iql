import { createHash } from 'crypto';

import type {
  BuilderInput,
  IParamAggregator,
  QueryCompiler,
  QueryParameters,
  ValueType,
} from './interfaces';

const createName = (queryText: string): string =>
  createHash('sha256').update(queryText).digest().toString('base64');

const createAggregator = <T, U>(
  params: QueryParameters<QueryCompiler<T, U>>
): IParamAggregator<T, U> => {
  const values: ValueType[] = [];
  const keyMap: Partial<Record<keyof U, string>> = {};

  return {
    get props() {
      if (Array.isArray(params) && values.length <= params.length) {
        return params;
      }

      return values;
    },
    key<K extends keyof U>(target: K) {
      if (!keyMap[target]) {
        const index = values.push((params[target] as unknown) as ValueType);

        keyMap[target] = `$${index}`;
      }

      return keyMap[target]!;
    },
    values<K extends keyof U>(args: K | ValueType[]) {
      const items = Array.isArray(args)
        ? args
        : ((params[args] as unknown) as ValueType[]);

      return items.map((item) => `$${values.push(item)}`).join(",");
    },
    value(item) {
      return `$${values.push(item)}`;
    },
  };
};

export const query = <T, K>(
  template: TemplateStringsArray,
  ...args: BuilderInput<T, K>[]
): QueryCompiler<T, K> => ({
  compile(compileValues) {
    const agg = createAggregator<T, K>(compileValues);

    const parts = Array.from(template);

    const text = args.reduce<string>((acc, arg) => {
      const target = (typeof arg === "function"
        ? arg(agg, compileValues)
        : arg) as string;

      return `${acc}${
        target in compileValues ? agg.key(target as keyof K) : target
      }${parts.shift()}`;
    }, parts.shift() ?? "");

    const name = createName(text);

    return { name, text, values: agg.props };
  },
});

export const extend = <
  T extends Record<string, unknown[]>,
  U extends Record<string, unknown>,
  K,
  L,
  M extends Record<string, unknown[]>,
  N extends Record<string, unknown>
>(
  input: QueryCompiler<K, L, M, N>,
  change: {
    from?: { [R in keyof T]: (...args: T[R]) => L };
    to?: { [R in keyof U]: (raw: K) => U[R] };
  }
): QueryCompiler<K, L, M & T, N & U> =>
  ({
    ...input,
    ...(change.from ? change.from : {}),
    ...(change.to ? change.to : {}),
  } as QueryCompiler<K, L, M & T, N & U>);
