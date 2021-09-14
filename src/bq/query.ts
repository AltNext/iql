import type { Query } from '@google-cloud/bigquery';

import type { BuilderInput, IParamAggregator, QueryCompiler, QueryParameters, ValueType } from '../interfaces';
import { generateQuery } from '../query-generator';

/**
 * Utility function to generate a consistent query name
 */
const createAggregator = <T, U>(params: QueryParameters<QueryCompiler<T, U>>): IParamAggregator<U, false> => {
  const values: Record<string, ValueType> = {};
  let index = Array.isArray(params) ? params.length : 0;
  const addParameter = (param: ValueType): `@${string}` => {
    // eslint-disable-next-line no-plusplus
    let key = `param_${index++}`;

    while (!Array.isArray(params) && (params?.[key] || params?.[key.split('_')[1]])) {
      // eslint-disable-next-line no-plusplus
      key = `param_${index++}`;
    }

    values[key] = param;

    return `@${key}`;
  };

  return {
    get props() {
      if (Array.isArray(params) && Object.entries(values).length === 0) {
        return params.reduce<Record<string, ValueType>>(
          (acc, param: ValueType, i) => ({ ...acc, [`param_${i}`]: param }),
          {},
        );
      }

      return values;
    },
    key<K extends keyof U>(target: K) {
      const key =
        typeof target === 'number' || parseInt(target as string, 10).toString() === target
          ? `param_${target as string}`
          : (target as string);

      if (!values[key]) {
        values[key] = params[target] as unknown as ValueType;
      }

      return `@${key}`;
    },
    values<K extends keyof U>(args: K | ValueType[]) {
      const items = Array.isArray(args) ? args : (params[args] as unknown as ValueType[]);

      return items.map((item) => addParameter(item)).join(',');
    },
    value(item) {
      return addParameter(item);
    },
  };
};

/**
 * ```typescript
 * interface IRawUser {
 *  id: string;
 *  name: string;
 * }
 *
 * interface IUserParams {
 *  id: string;
 *  ids: string[] | string;
 * }
 *
 * const findA = query<IRawUser, IUserParams>`
 * SELECT id, name FROM \`public.users\`
 * WHERE id = ${'id'}
 * -- WHERE id = @id
 * OR id = ${(agg) => agg.key('id')}
 * -- OR id = @id
 * OR id = ${(agg, { id }) => agg.value(id)} -- This creates a new parameter each time it is called
 * -- OR id = @param_0
 * OR id IN (${(agg, { ids }) => agg.values(ids)}); -- Creates parameters for each member of passed value, each time it is called.
 * OR id IN (${(agg) => agg.values('ids')}); -- Same as above
 * -- OR id IN (@param_1, @param_2, ..., @param_N);
 * `;
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export const query = <T, K = void>(
  template: TemplateStringsArray,
  ...args: BuilderInput<T, K, false>[]
): QueryCompiler<T, K, Record<string, never>, Record<string, never>, Query> => ({
  compile(compileValues) {
    const agg = createAggregator<T, K>(compileValues);

    return { query: generateQuery(template, agg, compileValues, args), params: agg.props };
  },
});
