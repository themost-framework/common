import { ConfigurationBase, TraceUtils } from '@themost/common';
import {resolve} from 'path';

class ApplicationConfigurationBase extends ConfigurationBase {

    private static _current: ApplicationConfigurationBase;

    public static get current(): ApplicationConfigurationBase {
        if (ApplicationConfigurationBase._current == null) {
            ApplicationConfigurationBase._current = new ApplicationConfigurationBase();
        }
        return ApplicationConfigurationBase._current;
    }

    public static set current(value: ApplicationConfigurationBase) {
        ApplicationConfigurationBase._current = value;
    }
    public executionPath: string;

    constructor(public readonly configurationPath?: any) {
        super();
        this.configurationPath = this.configurationPath || resolve(process.cwd(), 'config');
        this.executionPath = resolve(this.configurationPath, '..');
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
                TraceUtils.log('The environment specific configuration cannot be found or is inaccessible.');
                try {
                    configSourcePath = resolve(this.configurationPath, 'app.json');
                    TraceUtils.debug('Validating application configuration source on %s.', configSourcePath);
                    this.config = require(configSourcePath);
                } catch (err) {
                    if (err.code === 'MODULE_NOT_FOUND') {
                        TraceUtils.log('The default application configuration cannot be found or is inaccessible.');
                    } else {
                        TraceUtils.error('An error occurred while trying to open default application configuration.');
                        TraceUtils.error(err);
                    }
                    TraceUtils.debug('Initializing empty configuration');
                    this.config = {};
                }
            } else {
                TraceUtils.error('An error occurred while trying to open application configuration.');
                TraceUtils.error(err);
                //load default configuration
                this.config = {};
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
        if (ApplicationConfigurationBase.current == null) {
            ApplicationConfigurationBase.current = new ApplicationConfigurationBase();
        }
        return ApplicationConfigurationBase.current;
    }

    /**
     * Sets the current configuration
     * @param {ConfigurationBase} configuration
     * @deprecated Use ApplicationConfigurationBase.current setter instead
     * @returns ConfigurationBase - An instance of ApplicationConfiguration class which represents the current configuration
     */
     static setCurrent(configuration: ApplicationConfigurationBase): ApplicationConfigurationBase {
        if (configuration instanceof ApplicationConfigurationBase) {
            ApplicationConfigurationBase.current = configuration;
            return ApplicationConfigurationBase.current;
        }
        throw new TypeError('Invalid argument. Expected an instance of ApplicationConfigurationBase class.');
    }

}

export {
    ApplicationConfigurationBase
}