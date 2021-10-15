// MOST Web Framework 2.0 Codename ZeroGraviry Copyright (c) 2017-2021, THEMOST LP All rights reserved

import { AbstractMethodError } from './errors';
import { AbstractClassError } from './errors';
/**
 *
 * @class
 * @abstract
 * @param {string=} configPath
 */
class ApplicationBase {
    // eslint-disable-next-line no-unused-vars
    constructor(configPath) {
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
    // eslint-disable-next-line no-unused-vars
    useStrategy(serviceCtor, strategyCtor) {
        throw new AbstractMethodError();
    }
    /**
    * @param {Function} serviceCtor
    * @returns {boolean}
    */
    // eslint-disable-next-line no-unused-vars
    hasStrategy(serviceCtor) {
        throw new AbstractMethodError();
    }
    /**
     * Gets an application strategy based on the given base service type
     * @param {Function} serviceCtor
     * @return {*}
     */
    // eslint-disable-next-line no-unused-vars
    getStrategy(serviceCtor) {
        throw new AbstractMethodError();
    }
    /**
     * @returns {ConfigurationBase}
     */
    getConfiguration() {
        throw new AbstractMethodError();
    }
}

/**
 *
 * @class
 * @constructor
 * @param {ApplicationBase} app
 */
// eslint-disable-next-line no-unused-vars
class ApplicationService {
    constructor(app) {
        if (this.constructor === ApplicationService.prototype.constructor) {
            throw new AbstractClassError();
        }
        Object.defineProperty(this, 'application', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: app
        });
    }
    /**
     * @returns {ApplicationBase}
     */
    getApplication() {
        return this.application;
    }
}

export {
    ApplicationService,
    ApplicationBase
}
