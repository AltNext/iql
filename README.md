# iql

[![CircleCI](https://circleci.com/gh/AltNext/iql/tree/main.svg?style=svg)](https://circleci.com/gh/AltNext/iql/tree/main)
[![Coverage Status](https://coveralls.io/repos/github/AltNext/iql/badge.svg?branch=main)](https://coveralls.io/github/AltNext/iql?branch=master)

This package aims to make sql queries type safe and easy to build dynamically with expresive api

```typescript
import { query } from 'iql';

interface IRawA { id: string; foo: string; }

const findA = query<IRawA, { id: string }>`
SELECT id, foo FROM public.a
WHERE id = ${'id'};
`;
```