// MOST Web Framework Codename ZeroGraviry Copyright (c) 2017-2022, THEMOST LP All rights reserved

import { at as _at, set as _set} from 'lodash';
import { Args } from './utils';
import { AbstractClassError } from './errors';

declare interface WindowEnv {
    env?: {
        BROWSER_ENV?: string;
    };
}

// tslint:disable-next-line:ban-types
declare type StrategyConstructor<T> = Function & { prototype: T };

/**
 * @class Represents an application configuration
 * @param {string=} configurationPath
 * @property {*} settings
 * @constructor
 */
class ConfigurationBase {

    protected strategies: any = {};
    protected config: any = {
        settings: {
        }
    };

    constructor() {
        //
    }

    get settings(): any {
        return this.config.settings;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Returns the configuration source object
     * @returns {*}
     */
    getSource(): any {
        return this.config;
    }
    //noinspection JSUnusedGlobalSymbols
    /**
     * Returns the source configuration object based on the given path (e.g. settings.auth.cookieName or settings/auth/cookieName)
     * @param {string} p - A string which represents an object path
     * @returns {Object|Array}
     */
    getSourceAt(p: string): any {
        return _at(this.config, p.replace(/\//g, '.'))[0];
    }
    //noinspection JSUnusedGlobalSymbols
    /**
     * Returns a boolean which indicates whether the specified  object path exists or not (e.g. settings.auth.cookieName or settings/auth/cookieName)
     * @param {string} p - A string which represents an object path
     * @returns {boolean}
     */
    hasSourceAt(p: string): boolean {
        return _at(this.config, p.replace(/\//g, '.'))[0] != null;
    }
    //noinspection JSUnusedGlobalSymbols
    /**
     * Sets the config value to the specified object path (e.g. settings.auth.cookieName or settings/auth/cookieName)
     * @param {string} p - A string which represents an object path
     * @param {*} value
     * @returns {Object}
     */
    setSourceAt(p: string, value: any): void {
        return _set(this.config, p.replace(/\//g, '.'), value);
    }

    /**
     * Register a configuration strategy
     * @param {Function} strategyBaseCtor
     * @param {Function=} strategyCtor
     * @returns ConfigurationBase
     */
    useStrategy(strategyBaseCtor: any, strategyCtor?: any) {
        Args.notFunction(strategyBaseCtor, 'Configuration strategy constructor');
        if (typeof strategyCtor === 'undefined') {
            this.strategies['$'.concat(strategyBaseCtor.name)] = new strategyBaseCtor(this);
            return this;
        }
        Args.notFunction(strategyCtor, 'Strategy constructor');
        this.strategies['$'.concat(strategyBaseCtor.name)] = new strategyCtor(this);
        return this;
    }
    /**
     * Gets a configuration strategy
     * @param {Function} strategyBaseCtor
     */
     getStrategy<T>(strategyBaseCtor: StrategyConstructor<T>): T {
        Args.notFunction(strategyBaseCtor, 'Configuration strategy constructor');
        return this.strategies['$'.concat(strategyBaseCtor.name)];
    }

    /**
     * Gets a configuration strategy
     * @param {Function} strategyBaseCtor
     */
    hasStrategy(strategyBaseCtor: any) {
        Args.notFunction(strategyBaseCtor, 'Configuration strategy constructor');
        return typeof this.strategies['$'.concat(strategyBaseCtor.name)] !== 'undefined';
    }
}

class ConfigurationStrategy {
    private readonly _config: ConfigurationBase;
    constructor(config: ConfigurationBase) {
        Args.check(this.constructor.name !== ConfigurationStrategy.name, new AbstractClassError());
        Args.notNull(config, 'Configuration');
        this._config = config;
    }
    /**
     * @returns {ConfigurationBase}
     */
    getConfiguration() {
        return this._config;
    }
}


/**
 * @class
 * @constructor
 * @param {ConfigurationBase} config
 * @extends ConfigurationStrategy
 */
 abstract class ModuleLoaderStrategy extends ConfigurationStrategy {
    constructor(config: ConfigurationBase) {
        super(config);
    }
    abstract require(modulePath: string): any;
}

export {
    ConfigurationBase,
    ConfigurationStrategy,
    ModuleLoaderStrategy
}


