// @themost-ramework Codename Centroid Copyright (c) 2017-2025, THEMOST LP All rights reserved
import { at as _at, set as _set} from 'lodash';
import { Args } from './utils';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare interface WindowEnv {
    env?: {
        BROWSER_ENV?: string;
    };
}

// tslint:disable-next-line:ban-types
declare type StrategyConstructor<T> = {
    new (config: ConfigurationBase): T;
}

/**
 * @class Represents an application configuration
 * @param {string=} configurationPath
 * @property {*} settings
 * @constructor
 */
class ConfigurationBase {

    protected strategies: {
        [key: string]: any;
    } = {};
    
    constructor(protected config?: any) {
        if (typeof config === 'undefined') {
            this.config = {
                settings: {
                }
            };
        }    
    }
    
    get settings(): any {
        return this.config && this.config.settings;
    }

    getSource(): any {
        return this.config;
    }
    //noinspection JSUnusedGlobalSymbols
    /**
     * Returns the source configuration object based on the given path (e.g. settings.auth.cookieName or settings/auth/cookieName)
     * @param {string} p - A string which represents an object path
     * @returns {Object|Array}
     */
    getSourceAt<T>(p: string): T {
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
    useStrategy(strategyBaseCtor: StrategyConstructor<any>, strategyCtor?: StrategyConstructor<any>): this {
        Args.notFunction(strategyBaseCtor, 'Configuration strategy constructor');
        if (typeof strategyCtor === 'undefined') {
            this.strategies['$'.concat(strategyBaseCtor.name)] = new strategyBaseCtor(this);
            return this;
        }
        Args.notFunction(strategyCtor, 'Strategy constructor');
        this.strategies[`$${strategyBaseCtor.name}`] = new strategyCtor(this);
        return this;
    }
    /**
     * Gets a configuration strategy
     * @param {Function} strategyBaseCtor
     */
     getStrategy<T>(strategyBaseCtor: StrategyConstructor<T>): T {
        Args.notFunction(strategyBaseCtor, 'Configuration strategy constructor');
        return this.strategies[`$${strategyBaseCtor.name}`];
    }

    /**
     * Gets a configuration strategy
     * @param {Function} strategyBaseCtor
     */
    hasStrategy(strategyBaseCtor: StrategyConstructor<any>): boolean {
        Args.notFunction(strategyBaseCtor, 'Configuration strategy constructor');
        return typeof this.strategies[`$${strategyBaseCtor.name}`] !== 'undefined';
    }
}

/**
 * Abstract class representing a configuration strategy.
 * 
 * @abstract
 * @class ConfigurationStrategy
 * @param {ConfigurationBase} configuration - The base configuration object.
 * @throws {Error} If the configuration is null or undefined.
 */
abstract class ConfigurationStrategy {
    constructor(protected configuration: ConfigurationBase) {
        Args.notNull(configuration, 'Configuration');
    }
    /**
     * Retrieves the current configuration.
     *
     * @returns {ConfigurationBase} The current configuration instance.
     */
    getConfiguration(): ConfigurationBase {
        return this.configuration;
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

