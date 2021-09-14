iql / [Exports](modules.md)

# IQL

Inline Query Language

This package aims to make SQL-like queries type safe and easy to build dynamically with an expressive API

[![Test Status](https://github.com/altnext/iql/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/AltNext/iql/actions/workflows/test.yml?query=branch%3Amain)
[![Coverage Status](https://coveralls.io/repos/github/AltNext/iql/badge.svg?branch=main)](https://coveralls.io/github/AltNext/iql?branch=main)

[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=AltNext_iql&metric=bugs)](https://sonarcloud.io/dashboard?id=AltNext_iql)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=AltNext_iql&metric=code_smells)](https://sonarcloud.io/dashboard?id=AltNext_iql)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=AltNext_iql&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=AltNext_iql)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=AltNext_iql&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=AltNext_iql)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=AltNext_iql&metric=security_rating)](https://sonarcloud.io/dashboard?id=AltNext_iql)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=AltNext_iql&metric=sqale_index)](https://sonarcloud.io/dashboard?id=AltNext_iql)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=AltNext_iql&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=AltNext_iql)

[![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/altnext/iql)](https://app.snyk.io/org/altnext/project/https://app.snyk.io/org/altnext/project/615eb00b-5713-4b96-b95b-634bf66f43db)

[![npm](https://img.shields.io/npm/v/iql)](https://www.npmjs.com/package/iql)
[![NPM](https://img.shields.io/npm/l/iql)](https://www.npmjs.com/package/iql)
[![npm](https://img.shields.io/npm/dm/iql)](https://www.npmjs.com/package/iql)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/iql)](https://www.npmjs.com/package/iql)

[![GitHub issues](https://img.shields.io/github/issues-raw/altnext/iql)](https://www.github.com/altnext/iql)
[![GitHub pull requests](https://img.shields.io/github/issues-pr-raw/altnext/iql)](https://www.github.com/altnext/iql)
[![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/altnext/iql)](https://www.github.com/altnext/iql)
[![Lines of code](https://img.shields.io/tokei/lines/github/altnext/iql)](https://www.github.com/altnext/iql)
[![GitHub top language](https://img.shields.io/github/languages/top/altnext/iql)](https://www.github.com/altnext/iql)

```typescript
import { Client } from 'pg';
import { query } from 'iql';
import type { QueryResult } from 'iql';

interface IRawUser {
 id: string;
 name: string;
}

interface IUserParams {
 id: string;
 ids: string[];
}

const findA = query<IRawUser, IUserParams>`
SELECT id, name FROM public.users
  WHERE id = ${'id'}
-- WHERE id = $1
  OR id = ${(agg) => agg.key('id')}
-- OR id = $1
  OR id = ${(agg, { id }) => agg.value(id)} -- This creates a new parameter each time it is called
-- OR id = $2
  OR id IN (${(agg, { ids }) => agg.values(ids)}); -- Creates parameters for each member of passed value, each time it is called.
  OR id IN (${(agg) => agg.values('ids')}); -- Same as above
-- OR id IN ($3, $4, ..., $N);
`;

const pg = new Client();

const result = await pg.query<QueryResult<typeof findA>>(findA.compile({ id: '6', ids: ['a', 'b', '5'] }));

// row is of type IRawUser
result.rows.forEach((row) => {});
```

### Supported query executors

| Component | Query executors | Notes |
| :------ | :------ | :------ |
| `pg` | `pg` | Used as input to the `{Pool,Client}#query` method. Also exported as `query` for backwards compatibility. |
| `bq` | `@google-cloud/bigquery` | Used as input to the `BigQuery#createQueryJob` method. |
