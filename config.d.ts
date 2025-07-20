// tslint:disable-next-line:ban-types
declare type StrategyConstructor<T> = new(...arg?: unknown) => T;
/**
 * @class
 */
export declare class ConfigurationBase {
    /**
     * Gets the current configuration
     * @returns ConfigurationBase - An instance of DataConfiguration class which represents the current data configuration
     */
    public static getCurrent(): ConfigurationBase;
    /**
     * Sets the current configuration
     * @param {ConfigurationBase} configuration
     * @returns ConfigurationBase - An instance of ApplicationConfiguration class which represents the current configuration
     */
    public static setCurrent(configuration: ConfigurationBase): ConfigurationBase;
    public readonly settings: unknown;
    constructor(configPathOrSource?: string | unknown);
    /**
     * Register a configuration strategy
     * @param {Function} strategyBaseCtor
     * @param {Function=} strategyCtor
     * @returns ConfigurationBase
     */
    public useStrategy(strategyBaseCtor: StrategyConstructor, strategyCtor?: StrategyConstructor): this;
    /**
     * Gets a configuration strategy
     * @param {Function} strategyBaseCtor
     * @returns {ConfigurationStrategy|*}
     */
    getStrategy<T>(strategyBaseCtor: StrategyConstructor<T>): T;
    /**
     * Gets a configuration strategy
     * @param {Function} strategyBaseCtor
     */
    public hasStrategy<T>(strategyBaseCtor: StrategyConstructor<T>): boolean;
    /**
     * Returns the configuration source object
     * @returns {*}
     */
    public getSource(): unknown;
    /**
     * Returns the source configuration object based on the given path (e.g. settings.auth.cookieName or settings/auth/cookieName)
     * @param {string} p - A string which represents an object path
     * @returns {Object|Array}
     */
    public getSourceAt(p: string): unknown;
    /**
     * Returns a boolean which indicates whether the specified  object path exists or not (e.g. settings.auth.cookieName or settings/auth/cookieName)
     * @param {string} p - A string which represents an object path
     * @returns {boolean}
     */
    public hasSourceAt(p: string): boolean;
    /**
     * Sets the config value to the specified object path (e.g. settings.auth.cookieName or settings/auth/cookieName)
     * @param {string} p - A string which represents an object path
     * @param {*} value
     * @returns {Object}
     */
    public setSourceAt(p: string, value: unknown): unknown;
    /**
     * Sets the current execution path
     * @param {string} p
     */
    public setExecutionPath(p: string): ConfigurationBase;
    /**
     * Gets the current execution path
     * @returns {string}
     */
    public getExecutionPath(): string;
    /**
     * Gets the current configuration path
     * @returns {string}
     */
    public getConfigurationPath(): string;
}
/**
 * @class
 */
export declare class ConfigurationStrategy {
    /**
     * @constructor
     * @param {ConfigurationBase} config
     */
    constructor(config: ConfigurationBase);
    /**
     * @returns {ConfigurationBase}
     */
    public getConfiguration(): ConfigurationBase;
}
export declare class ModuleLoaderStrategy extends ConfigurationStrategy {
    /**
     *
     * @param {ConfigurationBase} config
     */
    constructor(config: ConfigurationBase);
    /**
     * @param {string} modulePath
     * @returns {*}
     */
    public require(modulePath: string): unknown;
}
export declare class DefaultModuleLoaderStrategy extends ModuleLoaderStrategy {
    /**
     *
     * @param {ConfigurationBase} config
     */
    constructor(config: ConfigurationBase);
}

declare global {
    interface Window {
        env?: {
            [k: string]: unknown;
        };
    }
}

