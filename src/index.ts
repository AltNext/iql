export { extend } from './extend';
export type {
  BaseQuery,
  BuilderInput,
  FromProps,
  IParamAggregator,
  QueryCompiler,
  QueryParameters,
  QueryResult,
  ToProps,
  ValueType,
} from './interfaces';

export { query as bq } from './bq';

export { intervalStringValue, intervalToMilliseconds, query as pg, query } from './pg';
export type { IPostgresInterval } from './pg';
