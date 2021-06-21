[iql](README.md) / Exports

# iql

## Table of contents

### Interfaces

- [IParamAggregator](interfaces/iparamaggregator.md)
- [IPostgresInterval](interfaces/ipostgresinterval.md)

### Type aliases

- [QueryCompiler](modules.md#querycompiler)
- [QueryParameters](modules.md#queryparameters)
- [QueryResult](modules.md#queryresult)
- [ValueType](modules.md#valuetype)

### Functions

- [extend](modules.md#extend)
- [intervalStringValue](modules.md#intervalstringvalue)
- [intervalToMilliseconds](modules.md#intervaltomilliseconds)
- [query](modules.md#query)

## Type aliases

### QueryCompiler

Ƭ **QueryCompiler**<Result, Params, From, To\>: `BaseQuery`<Result, Params, From, To\> & { `compile`: (`params`: `Params`) => `QueryConfig`<[ValueType](modules.md#valuetype)[]\>  }

Return type of the query/extend functions

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Result` | `Result` |
| `Params` | `Params` |
| `From` | `From`: `Record`<string, unknown[]\> = {} |
| `To` | `To`: `Record`<string, unknown\> = {} |

___

### QueryParameters

Ƭ **QueryParameters**<T\>: `T` extends [QueryCompiler](modules.md#querycompiler)<unknown, infer R\> ? `R` : `T` extends `BaseQuery`<unknown, infer S\> ? `S` : `never`

Utility type for getting a query's parameters

#### Type parameters

| Name |
| :------ |
| `T` |

___

### QueryResult

Ƭ **QueryResult**<T\>: `T` extends [QueryCompiler](modules.md#querycompiler)<infer K, unknown\> ? `K` : `T` extends `BaseQuery`<infer R, unknown\> ? `R` : `unknown`

Utility type for getting a query's result row type

#### Type parameters

| Name |
| :------ |
| `T` |

___

### ValueType

Ƭ **ValueType**: `Date` \| [ValueType](modules.md#valuetype)[] \| `boolean` \| `number` \| `object` \| `string` \| ``null``

Value types accepted by the pg library

## Functions

### extend

▸ `Const` **extend**<T, U, K, L, M, N\>(`input`, `change`): [QueryCompiler](modules.md#querycompiler)<K, L, `M` & `T`, `N` & `U`\>

const findB = extend(findA, {
  to: {
    public: (raw) => ({ ...raw, happy: true }),
  },
  from: {
    register: (name: string) => ({ id: generateRandomString(), name }),
  },
});

const row = findB.fromRegister('iql'); // row is of type IRawUser
const publicUser = findB.toPublic(row); // publicUser.happy === true

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T`: `Record`<string, unknown[]\> |
| `U` | `U`: `Record`<string, unknown\> |
| `K` | `K` |
| `L` | `L` |
| `M` | `M`: `Record`<string, unknown[]\> |
| `N` | `N`: `Record`<string, unknown\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [QueryCompiler](modules.md#querycompiler)<K, L, M, N\> |
| `change` | `Object` |
| `change.from?` | { [R in string \| number \| symbol]: function} |
| `change.to?` | { [R in string \| number \| symbol]: function} |

#### Returns

[QueryCompiler](modules.md#querycompiler)<K, L, `M` & `T`, `N` & `U`\>

___

### intervalStringValue

▸ `Const` **intervalStringValue**(`interval`): `string`

Translates Postgres interval object to string

#### Parameters

| Name | Type |
| :------ | :------ |
| `interval` | [IPostgresInterval](interfaces/ipostgresinterval.md) |

#### Returns

`string`

___

### intervalToMilliseconds

▸ `Const` **intervalToMilliseconds**(`interval`): `number`

Translates Postgres intervals to milliseconds

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `interval` | [IPostgresInterval](interfaces/ipostgresinterval.md) | IPostgresInterval to translate |

#### Returns

`number`

___

### query

▸ `Const` **query**<T, K\>(`template`, ...`args`): [QueryCompiler](modules.md#querycompiler)<T, K, `Object`, `Object`\>

```typescript
interface IRawUser {
 id: string;
 name: string;
}

interface IUserParams {
 id: string;
 ids: string[] | string;
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
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `K` | `K` = `void` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `template` | `TemplateStringsArray` |
| `...args` | `BuilderInput`<T, K\>[] |

#### Returns

[QueryCompiler](modules.md#querycompiler)<T, K, `Object`, `Object`\>
