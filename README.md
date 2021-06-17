# node-norm

[![CircleCI](https://circleci.com/gh/AltNext/node-norm/tree/main.svg?style=svg)](https://circleci.com/gh/AltNext/node-norm/tree/main)
[![Coverage Status](https://coveralls.io/repos/github/AltNext/node-norm/badge.svg?branch=main)](https://coveralls.io/github/AltNext/node-norm?branch=master)

This package aims to make sql queries type safe and easy to build dynamically with expresive api

```typescript
import { query } from 'node-norm';

interface IRawA { id: string; foo: string; }

const findA = query<IRawA, { id: string }>`
SELECT id, foo FROM public.a
WHERE id = ${'id'};
`;
```