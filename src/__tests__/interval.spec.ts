import { intervalStringValue, intervalToMiliseconds } from '../interval';

import type { IPostgresInterval } from '../interfaces';

describe('postrgres interval', () => {
  it('ms', () => {
    const interval: IPostgresInterval = {
      minutes: 10,
      seconds: 4,
      milliseconds: 3,
    };

    expect(intervalToMiliseconds(interval)).toStrictEqual(604003);
  });

  it('ms2', () => {
    const interval: IPostgresInterval = {
      days: 2,
      hours: 2,
    };

    expect(intervalToMiliseconds(interval)).toStrictEqual(180000000);
  });

  it('string', () => {
    const interval: IPostgresInterval = {
      minutes: 10,
      seconds: 4,
      milliseconds: 3,
    };

    expect(intervalStringValue(interval)).toStrictEqual('10 minutes 4 seconds 3 milliseconds');
  });
});
