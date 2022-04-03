// MOST Web Framework Codename Zero Gravity Copyright (c) 2017-2022, THEMOST LP All rights reserved
import { ConfigurationBase, ModuleLoaderStrategy, Args } from '@themost/common';
import { resolve, join } from 'path';

class DefaultModuleLoaderStrategy extends ModuleLoaderStrategy {
    constructor(config: ConfigurationBase) {
        super(config);
    }
    require(modulePath: string) {
        Args.notEmpty(modulePath, 'Module Path');
        const configuration = this.getConfiguration() as any;
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
                    if (paths.indexOf(join(path1, 'node_modules')) < 0) {
                        //add it
                        paths.push(join(path1, 'node_modules'));
                        //and check the next path which is going to be resolved
                        if (path1 === join(path1, '..')) {
                            // if it is the same with the current path break loop
                            break;
                        }
                        // otherwise, get parent path
                        path1 = join(path1, '..');
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
