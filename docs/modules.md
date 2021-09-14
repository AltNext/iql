[iql](README.md) / Exports

# iql

## Table of contents

### References

- [query](modules.md#query)

### Interfaces

- [IParamAggregator](interfaces/IParamAggregator.md)
- [IPostgresInterval](interfaces/IPostgresInterval.md)

### Type aliases

- [QueryCompiler](modules.md#querycompiler)
- [QueryParameters](modules.md#queryparameters)
- [QueryResult](modules.md#queryresult)
- [ValueType](modules.md#valuetype)

### Functions

- [bq](modules.md#bq)
- [extend](modules.md#extend)
- [intervalStringValue](modules.md#intervalstringvalue)
- [intervalToMilliseconds](modules.md#intervaltomilliseconds)
- [pg](modules.md#pg)

## References

### query

Renames and exports: [pg](modules.md#pg)

## Type aliases

### QueryCompiler

Ƭ **QueryCompiler**<`Result`, `Params`, `From`, `To`, `Compiled`\>: `BaseQuery`<`Result`, `Params`, `From`, `To`\> & { `compile`: (`params`: `Params`) => `Compiled`  }

Return type of the query/extend functions

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Result` | `Result` |
| `Params` | `Params` |
| `From` | extends `Record`<`string`, `unknown`[]\>{} |
| `To` | extends `Record`<`string`, `unknown`\>{} |
| `Compiled` | `QueryConfig`<[`ValueType`](modules.md#valuetype)[]\> |

___

### QueryParameters

Ƭ **QueryParameters**<`T`\>: `T` extends [`QueryCompiler`](modules.md#querycompiler)<`unknown`, infer R\> ? `R` : `T` extends `BaseQuery`<`unknown`, infer S\> ? `S` : `never`

Utility type for getting a query's parameters

#### Type parameters

| Name |
| :------ |
| `T` |

___

### QueryResult

Ƭ **QueryResult**<`T`\>: `T` extends [`QueryCompiler`](modules.md#querycompiler)<infer K, `unknown`\> ? `K` : `T` extends `BaseQuery`<infer R, `unknown`\> ? `R` : `unknown`

Utility type for getting a query's result row type

#### Type parameters

| Name |
| :------ |
| `T` |

___

### ValueType

Ƭ **ValueType**: `Date` \| [`ValueType`](modules.md#valuetype)[] \| `boolean` \| `number` \| `object` \| `string` \| ``null``

Value types accepted by the pg library

## Functions

### bq

▸ `Const` **bq**<`T`, `K`\>(`template`, ...`args`): [`QueryCompiler`](modules.md#querycompiler)<`T`, `K`, `Record`<`string`, `never`\>, `Record`<`string`, `never`\>, `Query`\>

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
SELECT id, name FROM \`public.users\`
WHERE id = ${'id'}
-- WHERE id = @id
OR id = ${(agg) => agg.key('id')}
-- OR id = @id
OR id = ${(agg, { id }) => agg.value(id)} -- This creates a new parameter each time it is called
-- OR id = @param_0
OR id IN (${(agg, { ids }) => agg.values(ids)}); -- Creates parameters for each member of passed value, each time it is called.
OR id IN (${(agg) => agg.values('ids')}); -- Same as above
-- OR id IN (@param_1, @param_2, ..., @param_N);
`;
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `K` | `void` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `template` | `TemplateStringsArray` |
| `...args` | `BuilderInput`<`T`, `K`, ``false``\>[] |

#### Returns

[`QueryCompiler`](modules.md#querycompiler)<`T`, `K`, `Record`<`string`, `never`\>, `Record`<`string`, `never`\>, `Query`\>

___

### extend

▸ `Const` **extend**<`T`, `U`, `K`, `L`, `M`, `N`, `Compiled`\>(`input`, `change`): [`QueryCompiler`](modules.md#querycompiler)<`K`, `L`, `M` & `T`, `N` & `U`, `Compiled`\>

const findB = extend(findA, {
  to: {
    public: (raw) => ({ ...raw, happy: true }),
  },
  from: {
    register: (id: string) => ({ id }),
  },
});

const params = findB.fromRegister('iql'); // row is of type IUserParams
const { rows } = await pg.query<QueryResylt<typeof findB>>(findB.compile(params));
const publicUser = findB.toPublic(rows[0]); // publicUser.happy === true

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Record`<`string`, `unknown`[]\> |
| `U` | extends `Record`<`string`, `unknown`\> |
| `K` | `K` |
| `L` | `L` |
| `M` | extends `Record`<`string`, `unknown`[]\> |
| `N` | extends `Record`<`string`, `unknown`\> |
| `Compiled` | `QueryConfig`<[`ValueType`](modules.md#valuetype)[]\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`QueryCompiler`](modules.md#querycompiler)<`K`, `L`, `M`, `N`, `Compiled`\> |
| `change` | `Object` |
| `change.from?` | { [R in string \| number \| symbol]: function} |
| `change.to?` | { [R in string \| number \| symbol]: function} |

#### Returns

[`QueryCompiler`](modules.md#querycompiler)<`K`, `L`, `M` & `T`, `N` & `U`, `Compiled`\>

___

### intervalStringValue

▸ `Const` **intervalStringValue**(`interval`): `string`

Translates Postgres interval object to string

#### Parameters

| Name | Type |
| :------ | :------ |
| `interval` | [`IPostgresInterval`](interfaces/IPostgresInterval.md) |

#### Returns

`string`

___

### intervalToMilliseconds

▸ `Const` **intervalToMilliseconds**(`interval`): `number`

Translates Postgres intervals to milliseconds

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `interval` | [`IPostgresInterval`](interfaces/IPostgresInterval.md) | IPostgresInterval to translate |

#### Returns

`number`

___

### pg

▸ `Const` **pg**<`T`, `K`\>(`template`, ...`args`): [`QueryCompiler`](modules.md#querycompiler)<`T`, `K`, `Object`, `Object`, `QueryConfig`<[`ValueType`](modules.md#valuetype)[]\>\>

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
| `K` | `void` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `template` | `TemplateStringsArray` |
| `...args` | `BuilderInput`<`T`, `K`, ``true``\>[] |

#### Returns

[`QueryCompiler`](modules.md#querycompiler)<`T`, `K`, `Object`, `Object`, `QueryConfig`<[`ValueType`](modules.md#valuetype)[]\>\>
