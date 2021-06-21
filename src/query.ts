import { createHash } from 'crypto';

import type {
  BuilderInput,
  IParamAggregator,
  QueryCompiler,
  QueryParameters,
  ValueType,
} from './interfaces';

/**
 * Utility function to generate a consistent query name
 */
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

      return items.map((item) => `$${values.push(item)}`).join(',');
    },
    value(item) {
      return `$${values.push(item)}`;
    },
  };
};

/**
 * ```typescript
 * interface IRawUser {
 *  id: string;
 *  name: string;
 * }

 * interface IUserParams {
 *  id: string;
 *  ids: string[] | string;
 * }

 * const findA = query<IRawUser, IUserParams>`
 * SELECT id, name FROM public.users
 * WHERE id = ${'id'}
 * -- WHERE id = $1
 * OR id = ${(agg) => agg.key('id')}
 * -- OR id = $1
 * OR id = ${(agg, { id }) => agg.value(id)} -- This creates a new parameter each time it is called
 * -- OR id = $2
 * OR id IN (${(agg, { ids }) => agg.values(ids)}); -- Creates parameters for each member of passed value, each time it is called.
 * OR id IN (${(agg) => agg.values('ids')}); -- Same as above
 * -- OR id IN ($3, $4, ..., $N);
 * `;
 * ```
 */
export const query = <T, K = void>(
  template: TemplateStringsArray,
  ...args: BuilderInput<T, K>[]
): QueryCompiler<T, K> => ({
  compile(compileValues) {
    const agg = createAggregator<T, K>(compileValues);

    const parts = Array.from(template);

    const text = args.reduce<string>((acc, arg) => {
      if (typeof arg === 'function') {
        return `${acc}${arg(agg, compileValues)}${parts.shift()}`;
      }

      return `${acc}${agg.key(arg)}${parts.shift()}`;
    }, parts.shift() as string);

    const name = createName(text);

    return { name, text, values: agg.props };
  },
});

/**
 * const findB = extend(findA, {
 *   to: {
 *     public: (raw) => ({ ...raw, happy: true }),
 *   },
 *   from: {
 *     register: (id: string) => ({ id }),
 *   },
 * });
 *
 * const params = findB.fromRegister('iql'); // row is of type IUserParams
 * const { rows } = await pg.query<QueryResylt<typeof findB>>(findB.compile(params));
 * const publicUser = findB.toPublic(rows[0]); // publicUser.happy === true
 */
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
    ...(change.from
      ? Object.entries(change.from).reduce(
          (acc, [from, value]) => ({
            ...acc,
            [`from${from[0].toUpperCase()}${from.slice(1)}`]: value,
          }),
          {}
        )
      : {}),
    ...(change.to
      ? Object.entries(change.to).reduce(
          (acc, [from, value]) => ({
            ...acc,
            [`to${from[0].toUpperCase()}${from.slice(1)}`]: value,
          }),
          {}
        )
      : {}),
  } as QueryCompiler<K, L, M & T, N & U>);
