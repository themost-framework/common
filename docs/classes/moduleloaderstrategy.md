[@themost/common](../README.md) / [Exports](../modules.md) / ModuleLoaderStrategy

# Class: ModuleLoaderStrategy

## Hierarchy

* [*ConfigurationStrategy*](configurationstrategy.md)

  ↳ **ModuleLoaderStrategy**

  ↳↳ [*DefaultModuleLoaderStrategy*](defaultmoduleloaderstrategy.md)

## Table of contents

### Constructors

- [constructor](moduleloaderstrategy.md#constructor)

### Methods

- [getConfiguration](moduleloaderstrategy.md#getconfiguration)
- [require](moduleloaderstrategy.md#require)

## Constructors

### constructor

\+ **new ModuleLoaderStrategy**(`config`: [*ConfigurationBase*](configurationbase.md)): [*ModuleLoaderStrategy*](moduleloaderstrategy.md)

#### Parameters:

Name | Type |
:------ | :------ |
`config` | [*ConfigurationBase*](configurationbase.md) |

**Returns:** [*ModuleLoaderStrategy*](moduleloaderstrategy.md)

Overrides: [ConfigurationStrategy](configurationstrategy.md)

Defined in: [config.d.ts:96](https://github.com/themost-framework/themost-common/blob/917834f/config.d.ts#L96)

## Methods

### getConfiguration

▸ **getConfiguration**(): [*ConfigurationBase*](configurationbase.md)

**Returns:** [*ConfigurationBase*](configurationbase.md)

Inherited from: [ConfigurationStrategy](configurationstrategy.md)

Defined in: [config.d.ts:94](https://github.com/themost-framework/themost-common/blob/917834f/config.d.ts#L94)

___

### require

▸ **require**(`modulePath`: *any*): *any*

#### Parameters:

Name | Type |
:------ | :------ |
`modulePath` | *any* |

**Returns:** *any*

Defined in: [config.d.ts:106](https://github.com/themost-framework/themost-common/blob/917834f/config.d.ts#L106)