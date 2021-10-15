// MOST Web Framework 2.0 Codename ZeroGraviry Copyright (c) 2017-2021, THEMOST LP All rights reserved

let _ = require('lodash');
import { Args, TraceUtils, PathUtils } from './utils';
import { AbstractClassError } from './errors';

declare interface WindowEnv {
    env?: {
        BROWSER_ENV?: string;
    };
}

declare type StrategyConstructor<T> = Function & { prototype: T };

/**
 * @class Represents an application configuration
 * @param {string=} configurationPath
 * @property {*} settings
 * @constructor
 */
class ConfigurationBase {

    private _strategies: any;
    private _configurationPath: string;
    private _executionPath: string;
    private _config: any;

    private static _currentConfiguration: ConfigurationBase;

    constructor(configurationPath?: any) {
        //init strategies
        this._strategies = {};

        this._configurationPath = configurationPath || PathUtils.join(process.cwd(), 'config');
        TraceUtils.debug('Initializing configuration under %s.', this._configurationPath);

        this._executionPath = PathUtils.join(this._configurationPath, '..');
        TraceUtils.debug('Setting execution path under %s.', this._executionPath);

        //load default module loader strategy
        this.useStrategy(ModuleLoaderStrategy, DefaultModuleLoaderStrategy);

        //get configuration source
        let configSourcePath;
        try {
            let env = 'production';
            //node.js mode
            if (process && process.env) {
                env = process.env['NODE_ENV'] || 'production';
            } else if (window && Object.prototype.hasOwnProperty.call(window, 'env')) {
                //browser mode
                env = (window as WindowEnv).env.BROWSER_ENV || 'production';
            }
            configSourcePath = PathUtils.join(this._configurationPath, 'app.' + env + '.json');
            TraceUtils.debug(`Validating environment configuration source on ${configSourcePath}.`);
            this._config = require(configSourcePath);
        } catch (err) {
            if (err.code === 'MODULE_NOT_FOUND') {
                TraceUtils.log('The environment specific configuration cannot be found or is inaccessible.');
                try {
                    configSourcePath = PathUtils.join(this._configurationPath, 'app.json');
                    TraceUtils.debug('Validating application configuration source on %s.', configSourcePath);
                    this._config = require(configSourcePath);
                } catch (err) {
                    if (err.code === 'MODULE_NOT_FOUND') {
                        TraceUtils.log('The default application configuration cannot be found or is inaccessible.');
                    } else {
                        TraceUtils.error('An error occurred while trying to open default application configuration.');
                        TraceUtils.error(err);
                    }
                    TraceUtils.debug('Initializing empty configuration');
                    this._config = {};
                }
            } else {
                TraceUtils.error('An error occurred while trying to open application configuration.');
                TraceUtils.error(err);
                //load default configuration
                this._config = {};
            }
        }
        //initialize settings object
        this._config['settings'] = this._config['settings'] || {};

        /**
         * @name ConfigurationBase#settings
         * @type {*}
         */
        Object.defineProperty(this, 'settings', {
            get: function () {
                return this._config['settings'];
            },
            enumerable: true,
            configurable: false
        });

    }
    //noinspection JSUnusedGlobalSymbols
    /**
     * Returns the configuration source object
     * @returns {*}
     */
    getSource() {
        return this._config;
    }
    //noinspection JSUnusedGlobalSymbols
    /**
     * Returns the source configuration object based on the given path (e.g. settings.auth.cookieName or settings/auth/cookieName)
     * @param {string} p - A string which represents an object path
     * @returns {Object|Array}
     */
    getSourceAt(p: string): any {
        return _.at(this._config, p.replace(/\//g, '.'))[0];
    }
    //noinspection JSUnusedGlobalSymbols
    /**
     * Returns a boolean which indicates whether the specified  object path exists or not (e.g. settings.auth.cookieName or settings/auth/cookieName)
     * @param {string} p - A string which represents an object path
     * @returns {boolean}
     */
    hasSourceAt(p: string): boolean {
        return _.isObject(_.at(this._config, p.replace(/\//g, '.'))[0]);
    }
    //noinspection JSUnusedGlobalSymbols
    /**
     * Sets the config value to the specified object path (e.g. settings.auth.cookieName or settings/auth/cookieName)
     * @param {string} p - A string which represents an object path
     * @param {*} value
     * @returns {Object}
     */
    setSourceAt(p: string, value: any): void {
        return _.set(this._config, p.replace(/\//g, '.'), value);
    }
    //noinspection JSUnusedGlobalSymbols
    /**
     * Sets the current execution path
     * @param {string} p
     * @returns ConfigurationBase
     */
    setExecutionPath(p: string): this {
        this._executionPath = p;
        return this;
    }
    /**
     * Gets the current execution path
     * @returns {string}
     */
    getExecutionPath(): string {
        return this._executionPath;
    }
    /**
     * Gets the current configuration path
     * @returns {string}
     */
    getConfigurationPath(): string {
        return this._configurationPath;
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
            this._strategies['$'.concat(strategyBaseCtor.name)] = new strategyBaseCtor(this);
            return this;
        }
        Args.notFunction(strategyCtor, 'Strategy constructor');
        this._strategies['$'.concat(strategyBaseCtor.name)] = new strategyCtor(this);
        return this;
    }
    /**
     * Gets a configuration strategy
     * @param {Function} strategyBaseCtor
     */
     getStrategy<T>(strategyBaseCtor: StrategyConstructor<T>): T {
        Args.notFunction(strategyBaseCtor, 'Configuration strategy constructor');
        return this._strategies['$'.concat(strategyBaseCtor.name)];
    }

    /**
     * Gets a configuration strategy
     * @param {Function} strategyBaseCtor
     */
    hasStrategy(strategyBaseCtor: any) {
        Args.notFunction(strategyBaseCtor, 'Configuration strategy constructor');
        return typeof this._strategies['$'.concat(strategyBaseCtor.name)] !== 'undefined';
    }
    /**
     * Gets the current configuration
     * @returns ConfigurationBase - An instance of DataConfiguration class which represents the current data configuration
     */
    static getCurrent() {
        if (ConfigurationBase._currentConfiguration == null) {
            ConfigurationBase._currentConfiguration = new ConfigurationBase();
        }
        return ConfigurationBase._currentConfiguration;
    }
    /**
     * Sets the current configuration
     * @param {ConfigurationBase} configuration
     * @returns ConfigurationBase - An instance of ApplicationConfiguration class which represents the current configuration
     */
    static setCurrent(configuration: ConfigurationBase) {
        if (configuration instanceof ConfigurationBase) {
            if (!configuration.hasStrategy(ModuleLoaderStrategy)) {
                configuration.useStrategy(ModuleLoaderStrategy, DefaultModuleLoaderStrategy);
            }
            ConfigurationBase._currentConfiguration = configuration;
            return ConfigurationBase._currentConfiguration;
        }
        throw new TypeError('Invalid argument. Expected an instance of DataConfiguration class.');
    }
}




class ConfigurationStrategy {
    private _config: ConfigurationBase;
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
class ModuleLoaderStrategy extends ConfigurationStrategy {
    constructor(config: ConfigurationBase) {
        super(config);
    }
    require(modulePath: string) {
        Args.notEmpty(modulePath, 'Module Path');
        if (!/^.\//i.test(modulePath)) {
            if (require.resolve && require.resolve.paths) {
                /**
                 * get require paths collection
                 * @type string[]
                 */
                let paths = require.resolve.paths(modulePath);
                //get execution
                let path1 = this.getConfiguration().getExecutionPath();
                //loop directories to parent (like classic require)
                while (path1) {
                    //if path does not exist in paths collection
                    if (paths.indexOf(PathUtils.join(path1, 'node_modules')) < 0) {
                        //add it
                        paths.push(PathUtils.join(path1, 'node_modules'));
                        //and check the next path which is going to be resolved
                        if (path1 === PathUtils.join(path1, '..')) {
                            //if it is the same with the current path break loop
                            break;
                        }
                        //otherwise get parent path
                        path1 = PathUtils.join(path1, '..');
                    } else {
                        //path already exists in paths collection, so break loop
                        break;
                    }
                }
                let finalModulePath = require.resolve(modulePath, {
                    paths: paths
                });
                return require(finalModulePath);
            } else {
                return require(modulePath);
            }
        }
        return require(PathUtils.join(this.getConfiguration().getExecutionPath(), modulePath));
    }
}

class DefaultModuleLoaderStrategy extends ModuleLoaderStrategy {
    constructor(config: ConfigurationBase) {
        super(config);
    }
}

export {
    ConfigurationBase,
    ConfigurationStrategy,
    ModuleLoaderStrategy,
    DefaultModuleLoaderStrategy
}


