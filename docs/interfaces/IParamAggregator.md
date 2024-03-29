[iql](../README.md) / [Exports](../modules.md) / IParamAggregator

# Interface: IParamAggregator<T, PropsArray\>

The aggregator, used by the query function to parse and manipulate parameters

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `PropsArray` | extends `boolean```true`` |

## Table of contents

### Properties

- [props](IParamAggregator.md#props)

### Methods

- [key](IParamAggregator.md#key)
- [value](IParamAggregator.md#value)
- [values](IParamAggregator.md#values)

## Properties

### props

• **props**: `PropsArray` extends ``true`` ? [`ValueType`](../modules.md#valuetype)[] : `Record`<`string`, [`ValueType`](../modules.md#valuetype)\>

## Methods

### key

▸ **key**<`K`\>(`key`): `string`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `K` |

#### Returns

`string`

___

### value

▸ **value**(`item`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`ValueType`](../modules.md#valuetype) |

#### Returns

`string`

___

### values

▸ **values**<`K`\>(`key`): `string`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `K` |

#### Returns

`string`

▸ **values**(`items`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `items` | [`ValueType`](../modules.md#valuetype)[] |

#### Returns

`string`
