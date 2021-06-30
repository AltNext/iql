[iql](../README.md) / [Exports](../modules.md) / IParamAggregator

# Interface: IParamAggregator<T\>

The aggregator, used by the query function to parse and manipulate parameters

## Type parameters

| Name |
| :------ |
| `T` |

## Table of contents

### Properties

- [props](iparamaggregator.md#props)

### Methods

- [key](iparamaggregator.md#key)
- [value](iparamaggregator.md#value)
- [values](iparamaggregator.md#values)

## Properties

### props

• **props**: [`ValueType`](../modules.md#valuetype)[]

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
