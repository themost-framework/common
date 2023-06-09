// MOST Web Framework Codename Zero Gravity Copyright (c) 2017-2022, THEMOST LP All rights reserved
import { ApplicationBase } from './app';
import { ConfigurationBase } from './config';
import { SequentialEventEmitterBase } from './emitter';

export type Types =
    | 'Float'
    | 'Boolean'
    | 'Date'
    | 'DateTime'
    | 'Integer'
    | 'Short'
    | 'Counter'
    | 'Duration'
    | 'Number'
    | 'Text'
    | 'Time'
    | 'URL'
    | 'Language'
    | 'Model'
    | 'Guid'
    | 'Object'
    | 'NegativeInteger'
    | 'NegativeNumber'
    | 'NonNegativeInteger'
    | 'NonNegativeNumber'
    | 'NonPositiveInteger'
    | 'NonPositiveNumber'
    | 'PositiveInteger'
    | 'PositiveNumber'
    | 'Email'
    | 'AbsoluteURI'
    | 'RelativeURI';

export declare interface ContextUserBase {

    name?: string;

    authenticationType?: string;

    authenticationToken?: string;

    authenticationProviderKey?: any;

    authenticationScope?: any;

    [k: string]: unknown;
}

export interface DataAssociationMappingBase {
    associationType?: 'association' | 'junction';
    associationAdapter?: string;
    associationObjectField?: string;
    associationValueField?: string;
    parentModel?: string;
    parentField?: string;
    childModel?: string;
    childField?: string;
    cascade?: 'delete' | 'none';
    options?: {
        /**
         * The $orderby system query option specifies the order in which items are returned from the service. e.g. $orderby=dateCreated desc
         */
        $orderby?: string;
        /**
         * The $select system query option requests that the service return only the properties, dynamic properties requested by the client e.g. $select=id,name,dateCreated
         */
        $select?: string;
        /**
         * The set of expanded entities can be further refined through the application of expand options, expressed as a semicolon-separated list of system query options.
         */
        $expand?: string;
        /**
         * The value of the $levels system query option is a positive integer to specify the number of levels to expand e.g. $levels=2
         */
        $levels?: string;
        [k: string]: unknown;
    };
    privileges?: DataModelPrivilegeBase[];
    [k: string]: unknown;
}

export interface DataFieldBase {
    /**
     * A string which represents a literal unique identifier for this attribute e.g. https://example.com/models/attributes/name
     */
    '@id'?: string;
    /**
     * A string which represents a short description of this attribute
     */
    description?: string;
    /**
     * A string which represents the name of this attribute e.g. title, description, dateCreated etc
     */
    name: string;
    /**
     * A string which represents a title for this attribute e.g. Date Created etc
     */
    title?: string;
    /**
     * A string which represents the type of this attribute e.g. Counter, Integer, Number, Text etc
     */
    type?: Types | string;
    /**
     * A number which represents the maximum size for this attribute e.g. the size of a text field etc
     */
    size?: number;
    /**
     * A boolean which indicates whether this attribute is nullable or not.
     */
    nullable?: boolean;
    /**
     * A boolean which indicates whether this attribute is a key column or not.
     */
    primary?: boolean;
    /**
     * An expression which represents the default value for this attribute.
     */
    value?: string;
    /**
     * An expression which represents the calculated value for this attribute.
     */
    calculation?: string;
    /**
     * A boolean which indicates whether this attribute is readonly or not. A readonly value must have a default value or a calculated value.
     */
    readonly?: boolean;
    /**
     * A boolean which indicates whether this attribute is editable or not.
     */
    editable?: boolean;
    /**
     * A boolean which indicates whether this attribute is an indexed column or not.
     */
    indexed?: boolean;
    /**
     * A string which optionally represents the name of this attribute in object mapping. This name may defer from the name of the database field.
     */
    property?: string;
    /**
     * A boolean value which indicates whether this attribute represents a one-to-many or many-to-many association between two models.
     */
    many?: boolean;
    /**
     * A boolean value which indicates whether the associated object(s) will be automatically expanded or not.
     */
    expandable?: boolean;
    /**
     * A boolean which indicates whether this attribute defines an association between two models where child objects are always treated as a part of the parent object.
     */
    nested?: boolean;
    /**
     * A number which represents the number of digits of a decimal number
     */
    scale?: number;
    /**
     * A string which defines the multiplicity level of an association between two objects
     */
    multiplicity?: 'ZeroOrOne' | 'Many' | 'One' | 'Unknown',

    mapping?: DataAssociationMappingBase;
    /**
     * Defines a data validator for this attribute
     */
    validation?: {
        /**
         * Sets a value which represents the min value.
         */
        minValue?: {
            [k: string]: unknown;
        };
        /**
         * Sets a value which represents the max value.
         */
        maxValue?: {
            [k: string]: unknown;
        };
        /**
         * Sets a value which represents the min length.
         */
        minLength?: number;
        /**
         * Sets a value which represents the max allowed length.
         */
        maxLength?: number;
        /**
         * A string which represents a regular expression that validates values of this attribute.
         */
        pattern?: string;
        /**
         * A string which represents a message that is going to be used when pattern validation fails.
         */
        patternMessage?: string;
        /**
         * A string which represents a message that is going to be used when validation fails.
         */
        message?: string;
        /**
         * Defines a validation against a pre-defined data type e.g. PositiveInteger, URL etc
         */
        type?: Types | string;
        /**
         * A string which represetns the module path that exports a custom validator e.g. ./validators/custom-validator.js
         */
        validator?: string;
        [k: string]: unknown;
    };

    virtual?: boolean;

    [k: string]: unknown;
}

export interface DataModelConstraintBase {
    /**
     * A string which represents the type of this constraint e.g. unique
     */
    type: 'unique';
    /**
     * A short description for this constraint e.g. Unique identifier field must be unique across different records.
     */
    description?: string;
    fields?: string[];
}

export interface DataModelEventListenerBase {
    /**
     * A string which the name of this event listener e.g. update person user listener
     */
    name?: string;
    /**
     * A string which represents the path of the module that exports this listener. This path may be a relative to execution folder path of a module exists in package modules e.g. ./listeners/add-user-listener or my-module/send-mail-listener
     */
    type: string;
}

export interface DataModelPrivilegeBase {
    /**
     * A number which represents permission mask (1=Read, 2=Create, 4=Update, 8=Delete, 16=Execute)
     */
    mask: number;
    /**
     * A string which represents the permission scope.
     */
    type: 'self' | 'global' | 'parent' | 'item';
    /**
     * A string which represents the name of the security group where this privilege will be applied e.g. Administrators, Sales etc.
     */
    account?: string;
    /**
     * A string which represents a filter expression for this privilege. This attribute is used for self privileges which are commonly derived from user's attributes e.g. 'owner eq me()' or 'orderStatus eq 1 and customer eq me()' etc.
     */
    filter?: string;
    /**
     * An array of OAuth2 client scopes as described here https://oauth.net/2/scope/. If current context does not have any of the provided scopes this privilege will be excluded. This option may be used in OAuth2 authorized environments or in any environment which implements such protocols.
     */
    scope?: string[];
    [k: string]: unknown;
}

export interface DataModelProperties {
    /**
     * A string which represents a literal unique identifier for this model e.g. https://example.com/models/User
     */
    '@id'?: string;
    /**
     * A string which represents the name of this model e.g. Order, Customer, Person etc
     */
    name: string;
    /**
     * An optional numeric identifier for this model e.g. 9587891
     */
    id?: number;
    /**
     * A string which represents the title of this e.g. Supplier Orders, Person Followers etc
     */
    title?: string;
    /**
     * A string which represents the model which is inherited by this model e.g. User inherits Account, Person inherits Party etc
     */
    inherits?: string;
    /**
     * A string which represents the model which is implemented by this model e.g. ActionStatusType model implements Enumeration model etc
     */
    implements?: string;
    /**
     * A boolean which indicates whether this model is being upgraded automatically or not. The default value is false.
     */
    sealed?: boolean;
    /**
     * A boolean which indicates whether this model is an abstract model or not. The default value is false.
     */
    abstract?: boolean;
    /**
     * A boolean which indicates whether this model is hidden or not. The default value is false.
     */
    hidden?: boolean;
    /**
     * A string which represents a module path that exports a class which maps this database model e.g. './models/some-model'
     */
    classPath?: string;
    /**
     * A string which holds the database object of this model. If this property is missing the database object's name is the concatenation of the model's name and the keyword 'Base' e.g. UserBase, PersonBase etc
     */
    source?: string;
    /**
     * A string which holds the database object that is going to be used for fetching data. If this property is missing this database object's name is the concatenation of the model's name and the keyword 'Data' e.g. UserData, PersonData etc
     */
    view?: string;
    /**
     * A string which represents the version of the model's schema. This version is going to be used in model upgrade operations e.g. 1.0, 0.1.2 etc
     */
    version: string;
    /**
     * A boolean which indicates whether model data will be cached or not. The default value is none -no caching-. A conditional caching allows developers to control caching mechanism while fetching data.
     */
    caching?: 'none' | 'always' | 'conditional';
    fields?: DataFieldBase[];
    constraints?: DataModelConstraintBase[];
    eventListeners?: DataModelEventListenerBase[];
    privileges?: DataModelPrivilegeBase[];
}

export interface DataModelBase extends DataModelProperties, SequentialEventEmitterBase {
    get context(): DataContextBase;
    set context(value: DataContextBase);
    asQueryable(): DataQueryableBase;
    base(): DataModelBase;
    clone(): DataModelBase;
    convert<T>(obj: any): T;
    find(obj: any):DataQueryableBase;
    getAttribute(name: string): DataFieldBase;
    getDataObjectType<T>(): new (...args: any) => T;
    getPrimaryKey(): DataFieldBase;
    getReferenceMappings(deep?: boolean): DataAssociationMappingBase[];
    getSubTypes(): string[];
    getSuperTypes(): string[];
    inferMapping(attr: any): DataAssociationMappingBase;
    inferState(obj: any, callback: (err?: Error, res?: any) => void): void;
    inferStateAsync(obj: any): Promise<any>;
    insert(obj: any | any[]): Promise<any>;
    silent(value?: boolean): DataModel;
    isSilent(): boolean;
    migrate(callback: (err?: Error, res?: boolean) => void): void;
    migrateAsync(): Promise<boolean>;
    save(obj: any | any[]): Promise<any>;
    silent(value?: boolean): this;
    update(obj: any | any[]): Promise<any>;
    remove(obj: any | any[]): Promise<any>;
    where(attr: string): DataQueryableBase;
    where<T>(expr: (value: T, ...param: any) => any, params?: any): DataQueryableBase;
    upsert(obj: any | Array<any>): Promise<any>;
    upsert(obj: any | Array<any>, callback: (err?: Error, result?: any) => void): void;
    upsertAsync(obj: any | Array<any>): Promise<any>;
}

export interface DataAdapterBase {
    rawConnection?:any;
    options?:any;
    open(callback:(err?:Error) => void): void;
    openAsync(): Promise<void>;
    close(callback:(err?:Error) => void): void;
    closeAsync(): Promise<void>;
    execute(query: any, values: any, callback: (err: Error, result?: any) => void): void;
    executeAsync(query: any, values: any): Promise<any>;
    selectIdentity(entity:string, attribute:string , callback?:(err?:Error, result?:any) => void): void;
    selectIdentityAsync(entity:string, attribute:string): Promise<any>;
    executeInTransaction(func: () => void, callback:(err?:Error) => void): void;
    executeInTransactionAsync(func: () => Promise<void>): Promise<void>;
    migrate(obj: DataAdapterMigration, callback: (err: Error, result?: any) => void): void;
    migrateAsync(obj: DataAdapterMigration): Promise<any>;
    createView(name: string, query: any, callback: (err: Error) => void): void;
}


export interface DataContextBase {
    db?: DataAdapterBase;
    application?: ApplicationBase;
    user?: ContextUserBase;

    model(name:any): DataModelBase;
    getConfiguration(): ConfigurationBase;
    finalize(callback?:(err?:Error) => void): void;
    finalizeAsync(): Promise<void>;
    executeInTransactionAsync(func: () => Promise<void>): Promise<void>;

}

export interface ListResult<T> {
    total?: number;
    skip?: number;
    value?: T[];
}

export interface DataQueryableBase {
    readonly model: DataModelBase;
    clone(): DataQueryableBase;
    where(attr: string): this;
    where<T>(expr: (value: T, ...param: any) => any, params?: any): this;
    search(text: string): this;
    join(model: any): this;
    and(attr: any): this;
    or(attr: any): this;
    prepare(orElse?: boolean): this;
    is(value: any): this;
    equal(value: any): this;
    notEqual(value: any): this;
    greaterThan(value: any): this;
    greaterOrEqual(value: any): this;
    bit(value: any, result?:number): this;
    lowerThan(value: any): this;
    lowerOrEqual(value: any): this;
    startsWith(value: any): this;
    endsWith(value: any): this;
    contains(value: any): this;
    notContains(value: any): this;
    between(value1: any, value2: any): this;
    select<T>(expr: (value: T, ...param: any) => any, params?: any): this;
    select<T,J>(expr: (value1: T, value2: J, ...param: any) => any, params?: any): this;
    select(...attr: any[]): this;
    orderBy(attr: any): this;
    orderBy<T>(expr: (value: T) => any): this;
    orderByDescending(attr: any): this;
    orderByDescending<T>(expr: (value: T) => any): this;
    thenBy(attr: any): this;
    thenBy<T>(expr: (value: T) => any): this;
    thenByDescending(attr: any): this;
    thenByDescending<T>(expr: (value: T) => any): this;
    groupBy(...attr: any[]): this;
    groupBy<T>(...args: [...expr:[(value: T) => any], params?: any]): this;
    skip(n:number): this;
    take(n:number): this;
    getItem<T>(): Promise<T>;
    getItems<T>(): Promise<T[]>;
    getTypedItem<T>(): Promise<T>;
    getTypedItems<T>(): Promise<T[]>;
    getList<T>(): Promise<ListResult<T>>;
    getTypedList<T>(): Promise<ListResult<T>>;
    getAllItems<T>(): Promise<T[]>;
    count(): Promise<number>;
    value(): Promise<any>;
    min(): Promise<any>;
    max(): Promise<any>;
    average(): Promise<any>;
    silent(value?: boolean): this;
    cache(value?: boolean): this;
    expand(...attr: any[]): this;
    expand<T>(...args: [...expr:[(value: T) => any], params?: any]): this;
    add(x: any): this;
    subtract(x: any): this;
    multiply(x: any): this;
    divide(x: any): this;
    round(n?:number): this;
    substr(start: number, length?:number): this;
    indexOf(s: string): this;
    concat(s: string): this;
    trim(): this;
    length(): this;
    getDate(): this;
    getYear(): this;
    getMonth(): this;
    getDay(): this;
    getFullYear(): this;
    getMinutes(): this;
    getSeconds(): this;
    getHours(): this;
    floor(): this;
    ceil(): this;
    toLowerCase(): this;
    toLocaleLowerCase(): this;
    toUpperCase(): this;
    toLocaleUpperCase(): this;
    levels(n:number): this;
    toExpand(): string;
}

export interface DataObjectBase {

    context?: DataContextBase;
    getType(): any;
    getId():any;
    save(context?: DataContextBase): Promise<void>;
    remove(context?: DataContextBase): Promise<void>;
    getModel(): DataModelBase;
    getAdditionalModel():Promise<DataModelBase>;
    getAdditionalObject():Promise<DataContextBase|any>;
    query(attr:string):DataQueryableBase;

}

export declare interface DataAdapterTable {
    create(fields: Array<any>, callback: (err: Error) => void): void;
    createAsync(fields: Array<any>): Promise<void>;
    add(fields: Array<any>, callback: (err: Error) => void): void;
    addAsync(fields: Array<any>): Promise<void>;
    change(fields: Array<any>, callback: (err: Error) => void): void;
    changeAsync(fields: Array<any>): Promise<void>;
    exists(callback: (err: Error, result: boolean) => void): void;
    existsAsync(): Promise<boolean>;
    version(callback: (err: Error, result: string) => void): void;
    versionAsync(): Promise<string>;
    columns(callback: (err: Error, result: Array<any>) => void): void;
    columnsAsync(): Promise<Array<any>>;
}

export declare interface DataAdapterIndex {
    name: string;
    columns: Array<string>;
}

export declare interface DataAdapterIndexes {
    create(name: string, columns: Array<string>, callback: (err: Error, res?: number) => void): void;
    createAsync(name: string, columns: Array<string>): Promise<number>;
    drop(name: string, callback: (err: Error, res?: number) => void): void;
    dropAsync(name: string): Promise<number>;
    list(callback: (err: Error, res: Array<DataAdapterIndex>) => void): void;
    listAsync(): Promise<Array<DataAdapterIndex>>;
}

export declare interface DataAdapterView {
    create(query: any, callback: (err: Error) => void): void;
    createAsync(query: any): Promise<void>;
    exists(callback: (err: Error, result: boolean) => void): void;
    existsAsync(): Promise<boolean>;
    drop(callback: (err: Error) => void): void;
    dropAsync(): Promise<void>;
}

export declare interface DataAdapterDatabase {
    exists(callback: (err: Error, result: boolean) => void): void;
    existsAsync(): Promise<boolean>;
    create(callback: (err: Error) => void): void;
    createAsync(): Promise<void>;
}

export declare interface DataAdapterMigration {
    add: Array<any>;
    change?: Array<any>;
    appliesTo: string;
    version: string;
    indexes?: Array<{name: string, columns: Array<string>}>;
    updated: boolean;
}

export declare interface DataAdapterBaseHelper {
    table(name: string): DataAdapterTable;
    view(name: string): DataAdapterView;
    indexes(name: string): DataAdapterIndexes;
    database(name: string): DataAdapterDatabase;
}