[iql](../README.md) / [Exports](../modules.md) / IParamAggregator

# Interface: IParamAggregator<T, U\>

The aggregator, used by the query function to parse and manipulate parameters

## Type parameters

| Name |
| :------ |
| `T` |
| `U` |

## Table of contents

### Properties

- [props](iparamaggregator.md#props)

### Methods

- [key](iparamaggregator.md#key)
- [value](iparamaggregator.md#value)
- [values](iparamaggregator.md#values)

## Properties

### props

• **props**: [ValueType](../modules.md#valuetype)[]

#### Defined in

[src/interfaces.ts:30](https://github.com/altnext/iql/blob/ab56ffc/src/interfaces.ts#L30)

## Methods

### key

▸ **key**<K\>(`key`): `string`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | `K`: `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `K` |

#### Returns

`string`

#### Defined in

[src/interfaces.ts:31](https://github.com/altnext/iql/blob/ab56ffc/src/interfaces.ts#L31)

___

### value

▸ **value**(`item`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [ValueType](../modules.md#valuetype) |

#### Returns

`string`

#### Defined in

[src/interfaces.ts:32](https://github.com/altnext/iql/blob/ab56ffc/src/interfaces.ts#L32)

___

### values

▸ **values**<K\>(`key`): `string`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | `K`: `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `K` |

#### Returns

`string`

#### Defined in

[src/interfaces.ts:33](https://github.com/altnext/iql/blob/ab56ffc/src/interfaces.ts#L33)

▸ **values**(`items`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `items` | [ValueType](../modules.md#valuetype)[] |

#### Returns

`string`

#### Defined in

[src/interfaces.ts:34](https://github.com/altnext/iql/blob/ab56ffc/src/interfaces.ts#L34)
