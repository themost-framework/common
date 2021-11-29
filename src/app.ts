// MOST Web Framework 2.0 Codename ZeroGraviry Copyright (c) 2017-2021, THEMOST LP All rights reserved

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


// tslint:disable-next-line:ban-types
declare type ApplicationServiceConstructor<T> = Function & { prototype: T };

interface IApplicationService {
    /**
     * Gets the application of this service
     * @returns {ApplicationBase}
     */
    getApplication(): ApplicationBase;
}

/**
 *
 * @class
 * @abstract
 * @param {string=} configPath
 */
 abstract class ApplicationBase implements IApplication {
    // eslint-disable-next-line no-unused-vars
    constructor(_configurationPath: string) {
        if (this.constructor === ApplicationBase.prototype.constructor) {
            throw new AbstractClassError();
        }
    }
    /**
     * Registers an application strategy e.g. an singleton service which to be used in application contextr
     * @param {Function} serviceCtor
     * @param {Function} strategyCtor
     * @returns IApplication
     */
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
// eslint-disable-next-line no-unused-vars
class ApplicationService implements IApplicationService {
    private _application: ApplicationBase;

    constructor(app: ApplicationBase) {
        if (this.constructor === ApplicationService.prototype.constructor) {
            throw new AbstractClassError();
        }
        this._application = app;
    }
    /**
     * @returns {ApplicationBase}
     */
    getApplication(): ApplicationBase {
        return this._application;
    }

    get application(): ApplicationBase {
        return this._application;
    }
}

export {
    ApplicationServiceConstructor,
    IApplication,
    IApplicationService,
    ApplicationBase,
    ApplicationService,
}
