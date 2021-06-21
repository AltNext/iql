# IQL

Inline Query Language

This package aims to make SQL-like queries type safe and easy to build dynamically with an expressive API

[![Coverage Status](https://github.com/altnext/iql/actions/workflows/test.yml/badge.svg)](https://github.com/AltNext/iql/actions/workflows/test.yml)
[![Coverage Status](https://coveralls.io/repos/github/AltNext/iql/badge.svg?branch=main)](https://coveralls.io/github/AltNext/iql?branch=main)

```typescript
import { query } from 'iql';

interface IRawUser {
  id: string; 
  name: string;
}

interface IUserParams {
  id: string;
}

const findA = query<IRawUser, IUserParams>`
SELECT id, name FROM public.users
WHERE id = ${'id'};
`;
```