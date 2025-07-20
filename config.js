const isObjectLike = require('lodash/isObjectLike');
const isObject = require('lodash/isObject');
const at = require('lodash/at');
const set = require('lodash/set');
const Symbol = require('symbol');
const {TraceUtils, Args, PathUtils} = require('./utils');

const currentConfiguration = Symbol('current');
const isNode = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';

class ConfigurationBase {
    /**
     * @class Represents an application configuration
     * @param {(string|*)=} configPathOrSource
     * @property {*} settings
     * @constructor
     */
    constructor(configPathOrSource) {
        //init strategies
        const strategies = new Map();

        Object.defineProperty(this, '_strategies', {
            enumerable: false,
            configurable: false,
            get: () => { return strategies; }
        });

        // set current configuration
        let source = {
            settings: {},
        };
        Object.defineProperty(this, '_source', {
            enumerable: false,
            configurable: false,
            get: () => { return source; }
        });
        // use default module loader strategy
        this.useStrategy(ModuleLoaderStrategy, DefaultModuleLoaderStrategy);
        // if configPathOrSource is not defined, then use the current working directory
        if (isNode) {
            // set configuration path to the current working directory
            this.configurationPath = PathUtils.join(process.cwd(), 'config');
            // set execution path to the current working directory
            this.executionPath = process.cwd();
        }
        if (typeof configPathOrSource === 'undefined') {
            return;
        }
        if (isObjectLike(configPathOrSource)) {
            // set configuration source
            source = configPathOrSource;
            // and return
            return;
        }
        this.configurationPath = configPathOrSource || PathUtils.join(process.cwd(), 'config');
        TraceUtils.debug(`Initializing configuration under ${this.configurationPath}`);
        this.executionPath = PathUtils.join(this.configurationPath, '..');
        TraceUtils.debug(`Set execution path under ${this.executionPath}`);
        //get configuration source
        var configSourcePath;
        try {
            var env = 'production';
            //node.js mode
            if (process && process.env) {
                env = process.env['NODE_ENV'] || 'production';
            }
            //browser mode
            else if (window && window.env) {
                env = window.env['BROWSER_ENV'] || 'production';
            }
            configSourcePath = PathUtils.join(this.configurationPath, 'app.' + env + '.json');
            TraceUtils.debug(`Validating environment configuration source on ${configSourcePath}`);
            source = require(configSourcePath);
        } catch (err) {
            if (err.code === 'MODULE_NOT_FOUND') {
                TraceUtils.debug('The environment specific configuration cannot be found or is inaccessible.');
                try {
                    configSourcePath = PathUtils.join(this.configurationPath, 'app.json');
                    TraceUtils.debug(`Validating application configuration source on ${configSourcePath}.`);
                    source = require(configSourcePath);
                } catch (err) {
                    if (err.code === 'MODULE_NOT_FOUND') {
                        TraceUtils.debug('The default application configuration cannot be found or is inaccessible.');
                    } else {
                        TraceUtils.error('An error occurred while trying to open default application configuration.');
                        TraceUtils.error(err);
                    }
                    TraceUtils.debug('Initializing empty configuration');
                    source = {};
                }
            } else {
                TraceUtils.error('An error occurred while trying to open application configuration.');
                TraceUtils.error(err);
            }
        }
        //initialize settings object
        source.settings = source.settings || {};

    }

    get settings() {
        return this._source.settings;
    }

    /**
     * Returns the configuration source object
     * @returns {*}
     */
    getSource() {
        return this._source;
    }

    /**
     * Returns the source configuration object based on the given path (e.g. settings.auth.cookieName or settings/auth/cookieName)
     * @param {string} p - A string which represents an object path
     * @returns {Object|Array}
     */
    getSourceAt(p) {
        return at(this._source, p.replace(/\//g, '.'))[0];
    }

    /**
     * Returns a boolean which indicates whether the specified  object path exists or not (e.g. settings.auth.cookieName or settings/auth/cookieName)
     * @param {string} p - A string which represents an object path
     * @returns {boolean}
     */
    hasSourceAt(p) {
        return isObject(at(this._source, p.replace(/\//g, '.'))[0]);
    }

    /**
     * Sets the config value to the specified object path (e.g. settings.auth.cookieName or settings/auth/cookieName)
     * @param {string} p - A string which represents an object path
     * @param {*} value
     * @returns {Object}
     */
    setSourceAt(p, value) {
        return set(this._source, p.replace(/\//g, '.'), value);
    }

    /**
     * Sets the current execution path
     * @param {string} p
     * @returns ConfigurationBase
     */
    setExecutionPath(p) {
        this.executionPath = p;
        return this;
    }

    /**
     * Gets the current execution path
     * @returns {string}
     */
    getExecutionPath() {
        return this.executionPath;
    }

    /**
     * Gets the current configuration path
     * @returns {string}
     */
    getConfigurationPath() {
        return this.configurationPath;
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
            this._strategies.set('$'.concat(strategyBaseCtor.name), new strategyBaseCtor(this));
            return this;
        }
        Args.notFunction(strategyCtor, 'Strategy constructor');
        this._strategies.set('$'.concat(strategyBaseCtor.name), new strategyCtor(this));
        return this;
    }

    /**
     * Gets a configuration strategy
     * @param {Function} strategyBaseCtor
     */
    getStrategy(strategyBaseCtor) {
        Args.notFunction(strategyBaseCtor, 'Configuration strategy constructor');
        return this._strategies.get('$'.concat(strategyBaseCtor.name));
    }

    /**
     * Gets a configuration strategy
     * @param {Function} strategyBaseCtor
     */
    hasStrategy(strategyBaseCtor) {
        Args.notFunction(strategyBaseCtor, 'Configuration strategy constructor');
        return this._strategies.has('$'.concat(strategyBaseCtor.name));
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
    /**
     * @class
     * @param {ConfigurationBase} config
     * @constructor
     * @abstract
     */
    constructor(config) {
        Args.notNull(config, 'Configuration');
        Object.defineProperty(this, '_configuration', {
            value: config,
            writable: false,
            enumerable: false,
            configurable: false
        });
    }

    /**
     * @returns {ConfigurationBase}
     */
    getConfiguration() {
        return this._configuration;
    }
}

class ModuleLoaderStrategy extends ConfigurationStrategy {
    /**
     * @constructor
     * @param {ConfigurationBase} config
     */
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
                var paths = require.resolve.paths(modulePath);
                //get execution
                var path1 = this.getConfiguration().getExecutionPath();
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
                var finalModulePath = require.resolve(modulePath, {
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

class DefaultModuleLoaderStrategy  extends ModuleLoaderStrategy {
    constructor(config) {
        super(config);
    }
}

module.exports = {
    ConfigurationBase,
    ConfigurationStrategy,
    ModuleLoaderStrategy,
    DefaultModuleLoaderStrategy
};

