import type { QueryConfig } from "pg";

/**
 * Postgres internal representation of intervals
 */
export interface IPostgresInterval {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
}

/**
 * Value types accepted by the pg library
 */
export type ValueType =
  | Date
  | ValueType[]
  | boolean
  | number
  | object
  | string
  | null;

/**
 * The aggregator, used by the query function to parse and manipulate parameters
 */
export interface IParamAggregator<T, U> {
  props: ValueType[];
  key<K extends keyof U>(key: K): string;
  value(item: ValueType): string;
  values<K extends keyof U>(key: K): string;
  values(items: ValueType[]): string;
}

/**
 * Utility type to rename props
 */
export type FromProps<K, T extends Record<string, unknown[]>> = {
  [R in keyof T as `from${Capitalize<R & string>}`]: (...args: T[R]) => K;
};

/**
 * Utility type to rename props
 */
export type ToProps<K, T extends Record<string, unknown>> = {
  [E in keyof T as `to${Capitalize<E & string>}`]: (raw: K) => T[E];
};

/**
 * Utility type, containing basic from* and to* helper functions
 */
export type BaseQuery<
  T,
  K,
  U extends Record<string, unknown[]> = {},
  F extends Record<string, unknown> = {}
> = FromProps<K, U> & ToProps<T, F>;

/**
 * Return type of the query/extend functions
 */
export type QueryCompiler<
  Result,
  Params,
  From extends Record<string, unknown[]> = {},
  To extends Record<string, unknown> = {}
> = BaseQuery<Result, Params, From, To> & {
  compile(params: Params): QueryConfig<ValueType[]>;
};

/**
 * Utility type for getting a query's parameters
 */
export type QueryParameters<T> = T extends QueryCompiler<unknown, infer R>
  ? R
  : T extends BaseQuery<unknown, infer S>
  ? S
  : never;

/**
 * Utility type for getting a query's result row type
 */
export type QueryResult<T> = T extends QueryCompiler<infer K, unknown>
  ? K
  : T extends BaseQuery<infer R, unknown>
  ? R
  : unknown;

/**
 * The type of the parameters passed into the TemplateStringsArray when calling the query function
 */
export type BuilderInput<T, U> =
  | keyof QueryParameters<QueryCompiler<T, U>>
  | ((
      agg: IParamAggregator<T, U>,
      values: QueryParameters<QueryCompiler<T, U>>
    ) => string);
