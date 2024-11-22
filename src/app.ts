// @themost-ramework Codename Centroid Copyright (c) 2017-2025, THEMOST LP All rights reserved
import { AbstractMethodError } from './errors';
import { AbstractClassError } from './errors';
import { ConfigurationBase } from './config';


interface IApplication {
    /**
     * Registers an application strategy e.g. an singleton service which to be used in application context
     * @param {Function} serviceCtor
     * @param {Function} strategyCtor
     * @returns IApplication
     */
     useService(serviceCtor: ApplicationServiceConstructor<any>, strategyCtor: ApplicationServiceConstructor<any>): this;
    /**
     * @param {Function} serviceCtor
     * @returns {boolean}
     */
    hasService(serviceCtor: ApplicationServiceConstructor<any>): boolean;

    /**
     * @param serviceCtor
     */
    getService<T>(serviceCtor: ApplicationServiceConstructor<T>): T;

    /**
     * Gets the configuration of this application
     * @returns {ConfigurationBase}
     */
    getConfiguration(): ConfigurationBase;
}

declare type ApplicationServiceConstructor<T> = {
    new (app: ApplicationBase): T;
};

interface IApplicationService {

    readonly application: ApplicationBase;
    getApplication(): ApplicationBase;
}

/**
 *
 * @class
 * @abstract
 * @param {string=} configPath
 */
 abstract class ApplicationBase implements IApplication {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(_configurationPath: string) {
    }
    
    abstract useStrategy(serviceCtor: ApplicationServiceConstructor<any>, strategyCtor: ApplicationServiceConstructor<any>): this;

    abstract useService(serviceCtor: ApplicationServiceConstructor<any>): this;

    abstract hasService<T>(serviceCtor: ApplicationServiceConstructor<T>): boolean;

    abstract getService<T>(serviceCtor: ApplicationServiceConstructor<T>): T;
    /**
     * @returns {ConfigurationBase}
     */
    getConfiguration(): ConfigurationBase {
        throw new AbstractMethodError();
    }
}

/**
 *
 * @class
 */
class ApplicationService implements IApplicationService {
    
    constructor(public readonly application: ApplicationBase) {
        if (this.constructor === ApplicationService.prototype.constructor) {
            throw new AbstractClassError();
        }
    }
    /**
     * Retrieves the current application instance.
     * 
     * @returns {ApplicationBase} The current application instance.
     */
    getApplication(): ApplicationBase {
        return this.application;
    }
}

export {
    ApplicationServiceConstructor,
    IApplication,
    IApplicationService,
    ApplicationBase,
    ApplicationService,
}
