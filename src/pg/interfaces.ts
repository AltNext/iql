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
