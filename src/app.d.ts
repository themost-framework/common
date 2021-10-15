import {ConfigurationBase} from './config';

export declare interface IApplication {
    /**
     * Registers an application strategy e.g. an singleton service which to be used in application context
     * @param {Function} serviceCtor
     * @param {Function} strategyCtor
     * @returns IApplication
     */
    useStrategy(serviceCtor: void, strategyCtor: void): this;
    /**
     * @param {Function} serviceCtor
     * @returns {boolean}
     */
    hasStrategy(serviceCtor: void): boolean;

    /**
     * @param serviceCtor
     */
    getStrategy<T>(serviceCtor: new() => T): T;

    /**
     * Gets the configuration of this application
     * @returns {ConfigurationBase}
     */
    getConfiguration(): ConfigurationBase;
}

export declare interface IApplicationService {
    /**
     * Gets the application of this service
     * @returns {ApplicationBase}
     */
    getApplication(): ApplicationBase;
}


// tslint:disable-next-line:ban-types
export declare type ApplicationServiceConstructor<T> = Function & { prototype: T };

export declare class ApplicationBase implements IApplication {

    readonly configuration: ConfigurationBase;

    abstract useStrategy(serviceCtor: ApplicationServiceConstructor<any>, strategyCtor: ApplicationServiceConstructor<any>): this;

    abstract useService(serviceCtor: ApplicationServiceConstructor<any>): this;

    abstract hasService<T>(serviceCtor: ApplicationServiceConstructor<T>): boolean;

    abstract getService<T>(serviceCtor: ApplicationServiceConstructor<T>): T;

    getConfiguration(): ConfigurationBase;
}

export declare class ApplicationService implements IApplicationService {
    readonly application: ApplicationBase;
    /**
     * @constructor
     * @param {ApplicationBase=} app
     */
    constructor(app: ApplicationBase);
    /**
     * Gets the application of this service
     * @returns {ApplicationBase}
     */
    getApplication(): ApplicationBase;
}


