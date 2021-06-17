import type { QueryConfig } from 'pg';

export interface IPostgresInterval {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
}

export type BaseQuery<
  T,
  K,
  U extends Record<string, unknown[]> = {},
  F extends Record<string, unknown> = {}
> = {
  [R in keyof U]: (...args: U[R]) => K;
} &
  { [E in keyof F]: (raw: T) => F[E] };

export type QueryCompiler<
  Result,
  Params,
  From extends Record<string, unknown[]> = {},
  To extends Record<string, unknown> = {}
> = BaseQuery<Result, Params, From, To> & {
  compile(params: Params): QueryConfig<ValueType[]>;
};

export type QueryParameters<T> = T extends QueryCompiler<unknown, infer R>
  ? R
  : T extends BaseQuery<unknown, infer S>
  ? S
  : [];

export type QueryResult<T> = T extends QueryCompiler<infer K, unknown>
  ? K
  : T extends BaseQuery<infer R, unknown>
  ? R
  : unknown;

export type BuilderInput<T, U> =
  | string
  | keyof QueryParameters<QueryCompiler<T, U>>
  | ((
      agg: IParamAggregator<T, U>,
      values: QueryParameters<QueryCompiler<T, U>>
    ) => string);

export type ValueType =
  | Date
  | ValueType[]
  | boolean
  | number
  | object
  | string
  | null;

export interface IParamAggregator<T, U> {
  props: ValueType[];
  key<K extends keyof U>(key: K): string;
  value(item: ValueType): string;
  values<K extends keyof U>(key: K): string;
  values(items: ValueType[]): string;
}
