iql / [Exports](modules.md)

# IQL

Inline Query Language

This package aims to make SQL-like queries type safe and easy to build dynamically with an expressive API

[![Coverage Status](https://github.com/altnext/iql/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/AltNext/iql/actions/workflows/test.yml?query=branch%3Amain)
[![Coverage Status](https://coveralls.io/repos/github/AltNext/iql/badge.svg?branch=main)](https://coveralls.io/github/AltNext/iql?branch=main)

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
