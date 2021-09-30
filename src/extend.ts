import type { QueryCompiler, ValueType } from './interfaces';
import type { QueryConfig } from 'pg';

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
 * const { rows } = await pg.query<QueryResult<typeof findB>>(findB.compile(params));
 * const publicUser = findB.toPublic(rows[0]); // publicUser.happy === true
 */
export const extend = <
  T extends Record<string, unknown[]>,
  U extends Record<string, unknown>,
  K,
  L,
  M extends Record<string, unknown[]>,
  N extends Record<string, unknown>,
  Compiled = QueryConfig<ValueType[]>,
>(
  input: QueryCompiler<K, L, M, N, Compiled>,
  change: {
    from?: { [R in keyof T]: (...args: T[R]) => L };
    to?: { [R in keyof U]: (raw: K) => U[R] };
  },
): QueryCompiler<K, L, M & T, N & U, Compiled> =>
  ({
    ...input,
    ...(change.from
      ? Object.entries(change.from).reduce(
          (acc, [from, value]) => ({
            ...acc,
            [`from${from[0].toUpperCase()}${from.slice(1)}`]: value as (...args: T[keyof T]) => L,
          }),
          {},
        )
      : {}),
    ...(change.to
      ? Object.entries(change.to).reduce(
          (acc, [from, value]) => ({
            ...acc,
            [`to${from[0].toUpperCase()}${from.slice(1)}`]: value as (raw: K) => U[keyof U],
          }),
          {},
        )
      : {}),
  } as QueryCompiler<K, L, M & T, N & U, Compiled>);
