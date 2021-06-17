# no-orm

[![CircleCI](https://circleci.com/gh/AltNext/no-orm/tree/main.svg?style=svg)](https://circleci.com/gh/AltNext/no-orm/tree/main)
[![Coverage Status](https://coveralls.io/repos/github/AltNext/no-orm/badge.svg?branch=main)](https://coveralls.io/github/AltNext/no-orm?branch=master)

This package aims to make sql queries type safe and easy to build dynamically with expresive api

```typescript
import { query } from 'no-orm';

interface IRawA { id: string; foo: string; }

const findA = query<IRawA, { id: string }>`
SELECT id, foo FROM public.a
WHERE id = ${'id'};
`;
```