import type { QueryConfig } from 'pg';

export interface IPostgresInterval {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
}

export type BaseQuery<T, K, U extends Record<string, unknown[]> = {}, F extends Record<string, unknown> = {}> = {
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

export type QueryParameters<T> = T extends QueryCompiler<infer K, infer R>
  ? R
  : T extends BaseQuery<infer R, infer S>
  ? S
  : [];

export type QueryResult<T> = T extends QueryCompiler<infer K, infer R>
  ? K
  : T extends BaseQuery<infer R, infer S>
  ? R
  : unknown;

export type BuilderInput<T> =
  | keyof QueryParameters<T>
  | string
  | ((agg: IParamAggregator<T>, values: QueryParameters<T>) => string);

export type ValueType = string | number | Date | null | object | ValueType[];

export interface IParamAggregator<T> {
  props: ValueType[];
  key<K extends keyof QueryParameters<T>>(key: K): string;
  value(item: ValueType): string;
  values<K extends keyof QueryParameters<T>>(key: K): string;
  values(items: ValueType[]): string;
}
