// MOST Web Framework Codename Zero Gravity Copyright (c) 2017-2022, THEMOST LP All rights reserved
import { ConfigurationBase, ModuleLoaderStrategy, TraceUtils } from '@themost/common';
import {resolve} from 'path';
import { DefaultModuleLoaderStrategy } from './DefaultModuleLoaderStrategy';

class ServerConfigurationBase extends ConfigurationBase {

    private static _current: ServerConfigurationBase;

    public static get current(): ServerConfigurationBase {
        if (ServerConfigurationBase._current == null) {
            ServerConfigurationBase._current = new ServerConfigurationBase();
        }
        return ServerConfigurationBase._current;
    }

    public static set current(value: ServerConfigurationBase) {
        ServerConfigurationBase._current = value;
    }
    public executionPath: string;

    constructor(public readonly configurationPath?: any) {
        super();
        this.configurationPath = this.configurationPath || resolve(process.cwd(), 'config');
        this.executionPath = resolve(this.configurationPath, '..');
        //load default module loader strategy
        this.useStrategy(ModuleLoaderStrategy, DefaultModuleLoaderStrategy);
        let configSourcePath;
        try {
            let env = 'production';
            //node.js mode
            if (process && process.env) {
                env = process.env.NODE_ENV || 'production';
            }
            configSourcePath = resolve(this.configurationPath, 'app.' + env + '.json');
            TraceUtils.debug(`Validating environment configuration source on ${configSourcePath}.`);
            this.config = require(configSourcePath);
        } catch (err) {
            if (err.code === 'MODULE_NOT_FOUND') {
                TraceUtils.debug('The environment specific configuration cannot be found or is inaccessible.');
                try {
                    configSourcePath = resolve(this.configurationPath, 'app.json');
                    TraceUtils.debug('Validating application configuration source on %s.', configSourcePath);
                    this.config = require(configSourcePath);
                } catch (err) {
                    if (err.code === 'MODULE_NOT_FOUND') {
                        TraceUtils.debug('The default application configuration cannot be found or is inaccessible.');
                    } else {
                        TraceUtils.error('An error occurred while trying to open default application configuration.');
                        TraceUtils.error(err);
                    }
                    TraceUtils.debug('Initializing empty configuration');
                    this.config = {
                        settings: {}
                    };
                }
            } else {
                TraceUtils.error('An error occurred while trying to open application configuration.');
                TraceUtils.error(err);
                //load default configuration
                this.config = {
                    settings: {}
                };
            }
        }
    }

    /**
     * Sets the current execution path
     * @deprecated Use ApplicationConfigurationBase#executionPath = value instead.
     * @param {string} path
     * @returns ConfigurationBase
     */
     setExecutionPath(path: string): this {
        this.executionPath = path;
        return this;
    }
    /**
     * Gets the current execution path
     * @deprecated Use ApplicationConfigurationBase#executionPath instead.
     * @returns {string}
     */
    getExecutionPath(): string {
        return this.executionPath;
    }

    /**
     * Gets the current configuration path
     * @deprecated Use ApplicationConfigurationBase#configurationPath instead.
     * @returns {string}
     */
     getConfigurationPath(): string {
        return this.configurationPath;
    }

    /**
     * Gets the current configuration
     * @returns ApplicationConfigurationBase
     * @deprecated Use ApplicationConfigurationBase.current getter instead
     */
     static getCurrent() {
        if (ServerConfigurationBase.current == null) {
            ServerConfigurationBase.current = new ServerConfigurationBase();
        }
        return ServerConfigurationBase.current;
    }

    /**
     * Sets the current configuration
     * @param {ConfigurationBase} configuration
     * @deprecated Use ApplicationConfigurationBase.current setter instead
     * @returns ConfigurationBase - An instance of ApplicationConfiguration class which represents the current configuration
     */
     static setCurrent(configuration: ServerConfigurationBase): ServerConfigurationBase {
        if (configuration instanceof ServerConfigurationBase) {
            ServerConfigurationBase.current = configuration;
            return ServerConfigurationBase.current;
        }
        throw new TypeError('Invalid argument. Expected an instance of ApplicationConfigurationBase class.');
    }

}

export {
    ServerConfigurationBase
}
