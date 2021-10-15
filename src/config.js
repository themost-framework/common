// MOST Web Framework 2.0 Codename ZeroGraviry Copyright (c) 2017-2021, THEMOST LP All rights reserved

let _ = require('lodash');
import { Args, TraceUtils, PathUtils } from './utils';
import { AbstractClassError } from './errors';

let configProperty = Symbol('config');
let currentConfiguration = Symbol('current');
let configPathProperty = Symbol('configurationPath');
let executionPathProperty = Symbol('executionPath');
let strategiesProperty = Symbol('strategies');

/**
 * @class Represents an application configuration
 * @param {string=} configPath
 * @property {*} settings
 * @constructor
 */
class ConfigurationBase {
    constructor(configPath) {
        //init strategies
        this[strategiesProperty] = {};

        this[configPathProperty] = configPath || PathUtils.join(process.cwd(), 'config');
        TraceUtils.debug('Initializing configuration under %s.', this[configPathProperty]);

        this[executionPathProperty] = PathUtils.join(this[configPathProperty], '..');
        TraceUtils.debug('Setting execution path under %s.', this[executionPathProperty]);

        //load default module loader strategy
        this.useStrategy(ModuleLoaderStrategy, DefaultModuleLoaderStrategy);

        //get configuration source
        let configSourcePath;
        try {
            let env = 'production';
            //node.js mode
            if (process && process.env) {
                env = process.env['NODE_ENV'] || 'production';
            }
            //browser mode
            else if (window && window.env) {
                env = window.env['BROWSER_ENV'] || 'production';
            }
            configSourcePath = PathUtils.join(this[configPathProperty], 'app.' + env + '.json');
            TraceUtils.debug('Validating environment configuration source on %s.', configSourcePath);
            this[configProperty] = require(configSourcePath);
        } catch (err) {
            if (err.code === 'MODULE_NOT_FOUND') {
                TraceUtils.log('The environment specific configuration cannot be found or is inaccessible.');
                try {
                    configSourcePath = PathUtils.join(this[configPathProperty], 'app.json');
                    TraceUtils.debug('Validating application configuration source on %s.', configSourcePath);
                    this[configProperty] = require(configSourcePath);
                } catch (err) {
                    if (err.code === 'MODULE_NOT_FOUND') {
                        TraceUtils.log('The default application configuration cannot be found or is inaccessible.');
                    } else {
                        TraceUtils.error('An error occurred while trying to open default application configuration.');
                        TraceUtils.error(err);
                    }
                    TraceUtils.debug('Initializing empty configuration');
                    this[configProperty] = {};
                }
            } else {
                TraceUtils.error('An error occurred while trying to open application configuration.');
                TraceUtils.error(err);
                //load default configuration
                this[configProperty] = {};
            }
        }
        //initialize settings object
        this[configProperty]['settings'] = this[configProperty]['settings'] || {};

        /**
         * @name ConfigurationBase#settings
         * @type {*}
         */
        Object.defineProperty(this, 'settings', {
            get: function () {
                return this[configProperty]['settings'];
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
        return this[configProperty];
    }
    //noinspection JSUnusedGlobalSymbols
    /**
     * Returns the source configuration object based on the given path (e.g. settings.auth.cookieName or settings/auth/cookieName)
     * @param {string} p - A string which represents an object path
     * @returns {Object|Array}
     */
    getSourceAt(p) {
        return _.at(this[configProperty], p.replace(/\//g, '.'))[0];
    }
    //noinspection JSUnusedGlobalSymbols
    /**
     * Returns a boolean which indicates whether the specified  object path exists or not (e.g. settings.auth.cookieName or settings/auth/cookieName)
     * @param {string} p - A string which represents an object path
     * @returns {boolean}
     */
    hasSourceAt(p) {
        return _.isObject(_.at(this[configProperty], p.replace(/\//g, '.'))[0]);
    }
    //noinspection JSUnusedGlobalSymbols
    /**
     * Sets the config value to the specified object path (e.g. settings.auth.cookieName or settings/auth/cookieName)
     * @param {string} p - A string which represents an object path
     * @param {*} value
     * @returns {Object}
     */
    setSourceAt(p, value) {
        return _.set(this[configProperty], p.replace(/\//g, '.'), value);
    }
    //noinspection JSUnusedGlobalSymbols
    /**
     * Sets the current execution path
     * @param {string} p
     * @returns ConfigurationBase
     */
    setExecutionPath(p) {
        this[executionPathProperty] = p;
        return this;
    }
    /**
     * Gets the current execution path
     * @returns {string}
     */
    getExecutionPath() {
        return this[executionPathProperty];
    }
    /**
     * Gets the current configuration path
     * @returns {string}
     */
    getConfigurationPath() {
        return this[configPathProperty];
    }
    /**
     * Register a configuration strategy
     * @param {Function} strategyBaseCtor
     * @param {Function=} strategyCtor
     * @returns ConfigurationBase
     */
    useStrategy(strategyBaseCtor, strategyCtor) {
        Args.notFunction(strategyBaseCtor, 'Configuration strategy constructor');
        if (typeof strategyCtor === 'undefined') {
            this[strategiesProperty]['$'.concat(strategyBaseCtor.name)] = new strategyBaseCtor(this);
            return this;
        }
        Args.notFunction(strategyCtor, 'Strategy constructor');
        this[strategiesProperty]['$'.concat(strategyBaseCtor.name)] = new strategyCtor(this);
        return this;
    }
    //noinspection JSUnusedGlobalSymbols
    /**
     * Gets a configuration strategy
     * @param {Function} strategyBaseCtor
     */
    getStrategy(strategyBaseCtor) {
        Args.notFunction(strategyBaseCtor, 'Configuration strategy constructor');
        return this[strategiesProperty]['$'.concat(strategyBaseCtor.name)];
    }
    /**
     * Gets a configuration strategy
     * @param {Function} strategyBaseCtor
     */
    hasStrategy(strategyBaseCtor) {
        Args.notFunction(strategyBaseCtor, 'Configuration strategy constructor');
        return typeof this[strategiesProperty]['$'.concat(strategyBaseCtor.name)] !== 'undefined';
    }
    /**
     * Gets the current configuration
     * @returns ConfigurationBase - An instance of DataConfiguration class which represents the current data configuration
     */
    static getCurrent() {
        if (ConfigurationBase[currentConfiguration] == null) {
            ConfigurationBase[currentConfiguration] = new ConfigurationBase();
        }
        return ConfigurationBase[currentConfiguration];
    }
    /**
     * Sets the current configuration
     * @param {ConfigurationBase} configuration
     * @returns ConfigurationBase - An instance of ApplicationConfiguration class which represents the current configuration
     */
    static setCurrent(configuration) {
        if (configuration instanceof ConfigurationBase) {
            if (!configuration.hasStrategy(ModuleLoaderStrategy)) {
                configuration.useStrategy(ModuleLoaderStrategy, DefaultModuleLoaderStrategy);
            }
            ConfigurationBase[currentConfiguration] = configuration;
            return ConfigurationBase[currentConfiguration];
        }
        throw new TypeError('Invalid argument. Expected an instance of DataConfiguration class.');
    }
}




class ConfigurationStrategy {
    constructor(config) {
        Args.check(this.constructor.name !== ConfigurationStrategy, new AbstractClassError());
        Args.notNull(config, 'Configuration');
        this[configProperty] = config;
    }
    /**
     * @returns {ConfigurationBase}
     */
    getConfiguration() {
        return this[configProperty];
    }
}


/**
 * @class
 * @constructor
 * @param {ConfigurationBase} config
 * @extends ConfigurationStrategy
 */
class ModuleLoaderStrategy extends ConfigurationStrategy {
    constructor(config) {
        super(config);
    }
    require(modulePath) {
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
    constructor(config) {
        super(config);
    }
}

export {
    ConfigurationBase,
    ConfigurationStrategy,
    ModuleLoaderStrategy,
    DefaultModuleLoaderStrategy
}


