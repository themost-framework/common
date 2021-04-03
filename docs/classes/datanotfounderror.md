[@themost/common](../README.md) / [Exports](../modules.md) / DataNotFoundError

# Class: DataNotFoundError

**`classdesc`** Extends Error object for throwing not found exceptions.

**`property`** {string} code - A string that represents an error code. The default error code is E_FOUND.

**`property`** {string} message -  The error message.

**`property`** {string} innerMessage - The error inner message.

**`property`** {number} status - A number that represents an error status. This error status may be used for throwing the appropriate HTTP error. The default status is 404 (Conflict)

**`property`** {string} model - The target model name

## Hierarchy

* [*DataError*](dataerror.md)

  ↳ **DataNotFoundError**

## Table of contents

### Constructors

- [constructor](datanotfounderror.md#constructor)

### Properties

- [code](datanotfounderror.md#code)
- [field](datanotfounderror.md#field)
- [innerMessage](datanotfounderror.md#innermessage)
- [message](datanotfounderror.md#message)
- [model](datanotfounderror.md#model)
- [name](datanotfounderror.md#name)
- [stack](datanotfounderror.md#stack)
- [statusCode](datanotfounderror.md#statuscode)
- [prepareStackTrace](datanotfounderror.md#preparestacktrace)
- [stackTraceLimit](datanotfounderror.md#stacktracelimit)

### Methods

- [captureStackTrace](datanotfounderror.md#capturestacktrace)

## Constructors

### constructor

\+ **new DataNotFoundError**(`message?`: *string*, `innerMessage?`: *string*, `model?`: *string*): [*DataNotFoundError*](datanotfounderror.md)

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`message?` | *string* | The error message   |
`innerMessage?` | *string* | The error inner message   |
`model?` | *string* | The target model    |

**Returns:** [*DataNotFoundError*](datanotfounderror.md)

Overrides: [DataError](dataerror.md)

Defined in: [errors.d.ts:276](https://github.com/themost-framework/themost-common/blob/917834f/errors.d.ts#L276)

## Properties

### code

• **code**: *string*

Gets or sets a string which may be used to identify this error e.g. E_DATA etc

Inherited from: [DataError](dataerror.md).[code](dataerror.md#code)

Defined in: [errors.d.ts:230](https://github.com/themost-framework/themost-common/blob/917834f/errors.d.ts#L230)

___

### field

• **field**: *string*

Gets or sets a string which represents the target data field, if any

Inherited from: [DataError](dataerror.md).[field](dataerror.md#field)

Defined in: [errors.d.ts:238](https://github.com/themost-framework/themost-common/blob/917834f/errors.d.ts#L238)

___

### innerMessage

• **innerMessage**: *string*

Gets or sets an inner message for this error.

Inherited from: [DataError](dataerror.md).[innerMessage](dataerror.md#innermessage)

Defined in: [errors.d.ts:242](https://github.com/themost-framework/themost-common/blob/917834f/errors.d.ts#L242)

___

### message

• **message**: *string*

Inherited from: [DataError](dataerror.md).[message](dataerror.md#message)

Defined in: node_modules/typescript/lib/lib.es5.d.ts:974

___

### model

• **model**: *string*

Gets or sets a string which represents the target data model, if any

Inherited from: [DataError](dataerror.md).[model](dataerror.md#model)

Defined in: [errors.d.ts:234](https://github.com/themost-framework/themost-common/blob/917834f/errors.d.ts#L234)

___

### name

• **name**: *string*

Inherited from: [DataError](dataerror.md).[name](dataerror.md#name)

Defined in: node_modules/typescript/lib/lib.es5.d.ts:973

___

### stack

• `Optional` **stack**: *string*

Inherited from: [DataError](dataerror.md).[stack](dataerror.md#stack)

Defined in: node_modules/typescript/lib/lib.es5.d.ts:975

___

### statusCode

• **statusCode**: *number*

Gets or sets a string which may be used to identify this error e.g. E_DATA etc

Inherited from: [DataError](dataerror.md).[statusCode](dataerror.md#statuscode)

Defined in: [errors.d.ts:226](https://github.com/themost-framework/themost-common/blob/917834f/errors.d.ts#L226)

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: Error, `stackTraces`: CallSite[]) => *any*

Optional override for formatting stack traces

**`see`** https://github.com/v8/v8/wiki/Stack%20Trace%20API#customizing-stack-traces

#### Type declaration:

▸ (`err`: Error, `stackTraces`: CallSite[]): *any*

#### Parameters:

Name | Type |
:------ | :------ |
`err` | Error |
`stackTraces` | CallSite[] |

**Returns:** *any*

Defined in: node_modules/@types/node/globals.d.ts:11

Inherited from: [DataError](dataerror.md).[prepareStackTrace](dataerror.md#preparestacktrace)

Defined in: node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: *number*

Inherited from: [DataError](dataerror.md).[stackTraceLimit](dataerror.md#stacktracelimit)

Defined in: node_modules/@types/node/globals.d.ts:13

## Methods

### captureStackTrace

▸ `Static`**captureStackTrace**(`targetObject`: *object*, `constructorOpt?`: Function): *void*

Create .stack property on a target object

#### Parameters:

Name | Type |
:------ | :------ |
`targetObject` | *object* |
`constructorOpt?` | Function |

**Returns:** *void*

Inherited from: [DataError](dataerror.md)

Defined in: node_modules/@types/node/globals.d.ts:4