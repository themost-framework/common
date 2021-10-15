// MOST Web Framework 2.0 Codename ZeroGraviry Copyright (c) 2017-2021, THEMOST LP All rights reserved

import { EventEmitter } from 'events';
import { applyEachSeries } from 'async';

/**
 * Wraps an async listener and returns a callback-like function
 * @param {function(...*):Promise<void>} asyncListener
 */
function wrapAsyncListener(asyncListener) {
    /**
     * @this SequentialEventEmitter
     */
    let result = function() {
        // get arguments without callback
        let args = [].concat(Array.prototype.slice.call(arguments, 0, arguments.length -1));
        // get callback
        let callback = arguments[arguments.length - 1];
        return asyncListener.apply(this, args).then(function() {
            return callback();
        }).catch(function(err) {
            return callback(err);
        });
    }
    // set async listener property in order to have an option to unsubscribe
    Object.defineProperty(result, '_listener', {
        configurable: true,
        enumerable: true,
        value: asyncListener
    });
    return result;
}

/**
 * Wraps an async listener and returns a callback-like function
 * @param {string} event
 * @param {function(...*):Promise<void>} asyncListener
 */
function wrapOnceAsyncListener(event, asyncListener) {
    /**
     * @this SequentialEventEmitter
     */
    let result = function() {
        let callee = arguments.callee;
        // get arguments without callback
        let args = [].concat(Array.prototype.slice.call(arguments, 0, arguments.length -1));
        // get callback
        let callback = arguments[arguments.length - 1];
        let self = this;
        return asyncListener.apply(self, args).then(function() {
            // manually remove async listener
            self.removeListener(event, callee);
            return callback();
        }).catch(function(err) {
            // manually remove async listener
            self.removeListener(event, callee);
            return callback(err);
        });
    }
    // set async listener property in order to have an option to unsubscribe
    Object.defineProperty(result, '_listener', {
        configurable: true,
        enumerable: true,
        value: asyncListener
    });
    return result;
}

// noinspection JSClosureCompilerSyntax,JSClosureCompilerSyntax,JSClosureCompilerSyntax,JSClosureCompilerSyntax
/**
 * SequentialEventEmitter class is an extension of node.js EventEmitter class where listeners are executing in series.
 */
class SequentialEventEmitter extends EventEmitter {
    constructor() {
        super();
    }
    // noinspection JSUnusedGlobalSymbols
    /**
     * Executes event listeners in series.
     * @param {String} event - The event that is going to be executed.
     * @param {...*} args - An object that contains the event arguments.
     */
    // eslint-disable-next-line no-unused-vars
    emit(event, args) {
        //ensure callback
        let callback = callback || function () { };
        //get listeners
        if (typeof this.listeners !== 'function') {
            throw new Error('undefined listeners');
        }
        let listeners = this.listeners(event);

        let argsAndCallback = [].concat(Array.prototype.slice.call(arguments, 1));
        if (argsAndCallback.length > 0) {
            //check the last argument (expected callback function)
            if (typeof argsAndCallback[argsAndCallback.length - 1] !== 'function') {
                throw new TypeError('Expected event callback');
            }
        }
        //get callback function (the last argument of arguments list)
        callback = argsAndCallback[argsAndCallback.length - 1];

        //validate listeners
        if (listeners.length === 0) {
            //exit emitter
            return callback();
        }
        //apply each series
        return applyEachSeries.apply(this, [listeners].concat(argsAndCallback));
    }
    // noinspection JSUnusedGlobalSymbols
    /**
     *
     * @param {string} event
     * @param {function(...*):Promise<void>} asyncListener
     * @returns this
     */
    subscribe(event, asyncListener) {
        return this.on(event, wrapAsyncListener(asyncListener));
    }
    // noinspection JSUnusedGlobalSymbols
    /**
     *
     * @param {string} event
     * @param {function(...*):Promise<void>} asyncListener
     * @returns this
     */
    unsubscribe(event, asyncListener) {
        // get event listeners
        let listeners = this.listeners(event);
        // enumerate
        for (let i = 0; i < listeners.length; i++) {
            let item = listeners[i];
            // if listener has an underlying listener
            if (typeof item._listener === 'function') {
                // and it's the same with the listener specified
                if (item._listener === asyncListener) {
                    // remove listener and break
                    this.removeListener(event, item);
                    break;
                }
            }
        }
        return this;
    }
    // noinspection JSUnusedGlobalSymbols
    /**
     *
     * @param {string} event
     * @param {function(...*):Promise<void>} asyncListener
     */
    subscribeOnce(event, asyncListener) {
        return this.once(event, wrapOnceAsyncListener(event, asyncListener));
    }
    // noinspection JSUnusedGlobalSymbols
    /**
     *
     * @param {string} event
     * @param {...args} args
     */
    // eslint-disable-next-line no-unused-vars
    next(event, args) {
        let self = this;
        /**
         * get arguments as array
         * @type {*[]}
         */
        let argsAndCallback = [event].concat(Array.prototype.slice.call(arguments, 1));
        // eslint-disable-next-line no-undef
        return new Promise(function (resolve, reject) {
            // set callback
            argsAndCallback.push(function (err) {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
            // emit event
            self.emit.apply(self, argsAndCallback);
        });

    }
}

export {
    SequentialEventEmitter
}