[iql](README.md) / Exports

# iql

## Table of contents

### References

- [query](modules.md#query)

### Interfaces

- [IParamAggregator](interfaces/IParamAggregator.md)
- [IPostgresInterval](interfaces/IPostgresInterval.md)

### Type aliases

- [BaseQuery](modules.md#basequery)
- [BuilderInput](modules.md#builderinput)
- [FromProps](modules.md#fromprops)
- [QueryCompiler](modules.md#querycompiler)
- [QueryParameters](modules.md#queryparameters)
- [QueryResult](modules.md#queryresult)
- [ToProps](modules.md#toprops)
- [ValueType](modules.md#valuetype)

### Functions

- [bq](modules.md#bq)
- [extend](modules.md#extend)
- [intervalStringValue](modules.md#intervalstringvalue)
- [intervalToMilliseconds](modules.md#intervaltomilliseconds)
- [pg](modules.md#pg)

## References

### query

Renames and re-exports [pg](modules.md#pg)

## Type aliases

### BaseQuery

Ƭ **BaseQuery**<`T`, `K`, `U`, `F`\>: [`FromProps`](modules.md#fromprops)<`K`, `U`\> & [`ToProps`](modules.md#toprops)<`T`, `F`\>

Utility type, containing basic from* and to* helper functions

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `K` | `K` |
| `U` | extends `Record`<`string`, `unknown`[]\>{} |
| `F` | extends `Record`<`string`, `unknown`\>{} |

___

### BuilderInput

Ƭ **BuilderInput**<`T`, `U`, `K`\>: keyof [`QueryParameters`](modules.md#queryparameters)<[`QueryCompiler`](modules.md#querycompiler)<`T`, `U`\>\> \| (`agg`: [`IParamAggregator`](interfaces/IParamAggregator.md)<`U`, `K`\>, `values`: [`QueryParameters`](modules.md#queryparameters)<[`QueryCompiler`](modules.md#querycompiler)<`T`, `U`\>\>) => `string`

The type of the parameters passed into the TemplateStringsArray when calling the query function

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `U` | `U` |
| `K` | extends `boolean```true`` |

___

### FromProps

Ƭ **FromProps**<`K`, `T`\>: { [R in keyof T as \`from${Capitalize<R & string\>}\`]: Function }

Utility type to rename props

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | `K` |
| `T` | extends `Record`<`string`, `unknown`[]\> |

___

### QueryCompiler

Ƭ **QueryCompiler**<`Result`, `Params`, `From`, `To`, `Compiled`\>: [`BaseQuery`](modules.md#basequery)<`Result`, `Params`, `From`, `To`\> & { `compile`: (`params`: `Params`) => `Compiled`  }

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

Ƭ **QueryParameters**<`T`\>: `T` extends [`QueryCompiler`](modules.md#querycompiler)<`unknown`, infer R\> ? `R` : `T` extends [`BaseQuery`](modules.md#basequery)<`unknown`, infer S\> ? `S` : `never`

Utility type for getting a query's parameters

#### Type parameters

| Name |
| :------ |
| `T` |

___

### QueryResult

Ƭ **QueryResult**<`T`\>: `T` extends [`QueryCompiler`](modules.md#querycompiler)<infer K, `unknown`\> ? `K` : `T` extends [`BaseQuery`](modules.md#basequery)<infer R, `unknown`\> ? `R` : `unknown`

Utility type for getting a query's result row type

#### Type parameters

| Name |
| :------ |
| `T` |

___

### ToProps

Ƭ **ToProps**<`K`, `T`\>: { [E in keyof T as \`to${Capitalize<E & string\>}\`]: Function }

Utility type to rename props

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | `K` |
| `T` | extends `Record`<`string`, `unknown`\> |

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
| `...args` | [`BuilderInput`](modules.md#builderinput)<`T`, `K`, ``false``\>[] |

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
const { rows } = await pg.query<QueryResult<typeof findB>>(findB.compile(params));
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
| `change.from?` | { [R in string \| number \| symbol]: Function } |
| `change.to?` | { [R in string \| number \| symbol]: Function } |

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
| `...args` | [`BuilderInput`](modules.md#builderinput)<`T`, `K`, ``true``\>[] |

#### Returns

[`QueryCompiler`](modules.md#querycompiler)<`T`, `K`, `Object`, `Object`, `QueryConfig`<[`ValueType`](modules.md#valuetype)[]\>\>
