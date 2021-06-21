# IQL

[![CircleCI](https://circleci.com/gh/AltNext/iql/tree/main.svg?style=svg)](https://circleci.com/gh/AltNext/iql/tree/main)
[![Coverage Status](https://coveralls.io/repos/github/AltNext/iql/badge.svg?branch=main)](https://coveralls.io/github/AltNext/iql?branch=master)

Inline Query Language

This package aims to make SQL-like queries type safe and easy to build dynamically with an expressive API

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