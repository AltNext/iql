export { extend } from './extend';
export type { IParamAggregator, QueryCompiler, QueryParameters, QueryResult, ValueType } from './interfaces';

export { query as bq } from './bq';

export { intervalStringValue, intervalToMilliseconds, query as pg, query } from './pg';
export type { IPostgresInterval } from './pg';
