import { ConfigurationBase, ModuleLoaderStrategy, PathUtils, Args } from '@themost/common';
import { ApplicationConfigurationBase } from './ApplicationConfigurationBase';
import { resolve } from 'path';

class DefaultModuleLoaderStrategy extends ModuleLoaderStrategy {
    constructor(config: ApplicationConfigurationBase) {
        super(config);
    }
    require(modulePath: string) {
        Args.notEmpty(modulePath, 'Module Path');
        const configuration = this.getConfiguration() as ApplicationConfigurationBase;
        if (!/^.\//i.test(modulePath)) {
            if (require.resolve && require.resolve.paths) {
                /**
                 * get require paths collection
                 * @type string[]
                 */
                const paths: string[] = require.resolve.paths(modulePath);
                //get execution
                let path1 = configuration.executionPath;
                //loop directories to parent (like classic require)
                while (path1) {
                    //if path does not exist in paths collection
                    if (paths.indexOf(PathUtils.join(path1, 'node_modules')) < 0) {
                        //add it
                        paths.push(PathUtils.join(path1, 'node_modules'));
                        //and check the next path which is going to be resolved
                        if (path1 === PathUtils.join(path1, '..')) {
                            // if it is the same with the current path break loop
                            break;
                        }
                        // otherwise, get parent path
                        path1 = PathUtils.join(path1, '..');
                    } else {
                        // path already exists in paths collection, so break loop
                        break;
                    }
                }
                const finalModulePath = require.resolve(modulePath, {
                    paths
                });
                return require(finalModulePath);
            } else {
                return require(modulePath);
            }
        }
        return require(resolve(configuration.executionPath, modulePath));
    }
}

export {
    DefaultModuleLoaderStrategy
}