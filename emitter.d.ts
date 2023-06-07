/// <reference types="node" />
import { EventEmitter } from 'events';

export declare interface SequentialEventEmitterBase {
    emit(event: string | symbol, ...args: any[]): any;
    addListener(event: string | symbol, listener: (...args: any[]) => void): this;
    on(event: string | symbol, listener: (...args: any[]) => void): this;
    prependListener(event: string | symbol, listener: (...args: any[]) => void): this;
    prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this;
    removeListener(event: string | symbol, listener: (...args: any[]) => void): this;
    removeAllListeners(event?: string | symbol): this;
    setMaxListeners(n: number): this;
    getMaxListeners(): number;
    listenerCount(type: string | symbol): number;
    once(event: string | symbol, listener: (...args: any[]) => void): this;
    subscribe(event: string | symbol, asyncListener: (...args: any[]) => Promise<void>): this;
    unsubscribe(event: string | symbol, asyncListener: (...args: any[]) => Promise<void>): this;
    subscribeOnce(event: string | symbol, asyncListener: (...args: any[]) => Promise<void>): this;
    next(event: string | symbol, ...args: any[]): Promise<void>;
}

/**
 * @class
 * @extends EventEmitter
 */
export declare class SequentialEventEmitter extends EventEmitter implements SequentialEventEmitterBase {
    /**
     * @constructor
     */
    constructor();
    emit(event: string | symbol, ...args: any[]): any;
    addListener(event: string | symbol, listener: (...args: any[]) => void): this;
    on(event: string | symbol, listener: (...args: any[]) => void): this;
    prependListener(event: string | symbol, listener: (...args: any[]) => void): this;
    prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this;
    removeListener(event: string | symbol, listener: (...args: any[]) => void): this;
    removeAllListeners(event?: string | symbol): this;
    setMaxListeners(n: number): this;
    getMaxListeners(): number;
    listenerCount(type: string | symbol): number;
    once(event: string | symbol, listener: (...args: any[]) => void): this;
    subscribe(event: string | symbol, asyncListener: (...args: any[]) => Promise<void>): this;
    unsubscribe(event: string | symbol, asyncListener: (...args: any[]) => Promise<void>): this;
    subscribeOnce(event: string | symbol, asyncListener: (...args: any[]) => Promise<void>): this;
    next(event: string | symbol, ...args: any[]): Promise<void>;
}
