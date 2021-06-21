import type { IPostgresInterval } from './interfaces';

/**
 * Translates Postgres intervals to milliseconds
 * @param interval - IPostgresInterval to translate
 */
export const intervalToMilliseconds = (interval: IPostgresInterval): number => {
  let milliseconds = 0;

  if (interval.milliseconds) {
    milliseconds += interval.milliseconds;
  }

  if (interval.seconds) {
    milliseconds += interval.seconds * 1000;
  }

  if (interval.minutes) {
    milliseconds += interval.minutes * 60 * 1000;
  }

  if (interval.hours) {
    milliseconds += interval.hours * 60 * 60 * 1000;
  }

  if (interval.days) {
    milliseconds += interval.days * 24 * 60 * 60 * 1000;
  }

  return milliseconds;
};

/**
 * Translates Postgres interval object to string
 * @param interval
 */
export const intervalStringValue = (interval: IPostgresInterval): string =>
  Object.entries(interval)
    .map(([key, value]) => `${value} ${key}`)
    .join(' ');
