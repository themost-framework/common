import {SequentialEventEmitter} from '../src';

describe('SequentialEventEmitter', () => {

    it('should create instance', ()=> {
       const emitter = new SequentialEventEmitter();
       expect(emitter).toBeTruthy();
    });

    it('should use SequentialEventEmitter.subscribe()', async ()=> {
        const emitter = new SequentialEventEmitter();
        emitter.subscribe('before.action', (event: { value: number }) => {
            event.value += 1;
            return Promise.resolve();
        });
        emitter.subscribe('before.action', (event: { value: number }) => {
            event.value += 1;
            return Promise.resolve();
        });
        const eventArgs = {
            value: 100
        }
        await emitter.next('before.action', eventArgs);
        expect(eventArgs.value).toBe(102);
    });

    it('should use SequentialEventEmitter.unsubscribe()', async ()=> {
        const emitter = new SequentialEventEmitter();
        const listener = (event: { value: number }) => {
            event.value += 1;
            return Promise.resolve();
        }
        emitter.subscribe('before.action', listener);
        expect(emitter.listenerCount('before.action')).toBe(1);
        emitter.unsubscribe('before.action', listener)
        expect(emitter.listenerCount('before.action')).toBe(0);

        emitter.subscribeOnce('before.action', listener);
        expect(emitter.listenerCount('before.action')).toBe(1);
        emitter.unsubscribe('before.action', listener)
        expect(emitter.listenerCount('before.action')).toBe(0);

    });

    fit('should use SequentialEventEmitter.on()', async ()=> {
        const emitter = new SequentialEventEmitter();
        emitter.on('before.action', function(ev, callback) {
            ev.value += 2;
            return callback();
        });
        emitter.on('before.action', function(ev, callback) {
            ev.value += 2;
            return callback();
        });
        let eventArgs = {
            value: 0
        }
        await new Promise<void>((resolve, reject) => {
            emitter.emit('before.action', eventArgs, function(err: Error) {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
        let listenerCount = emitter.listenerCount('before.action');
        expect(listenerCount).toBe(2);
        expect(eventArgs.value).toBe(4);
        emitter.removeAllListeners('before.action');
        listenerCount = emitter.listenerCount('before.action');
        expect(listenerCount).toBe(0);

        eventArgs.value = 0;
        emitter.once('before.action', function(ev, callback) {
            ev.value += 2;
            return callback();
        });
        await new Promise<void>((resolve, reject) => {
            emitter.emit('before.action', eventArgs, function(err: Error) {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
        expect(eventArgs.value).toBe(2);
        listenerCount = emitter.listenerCount('before.action');
        expect(listenerCount).toBe(0);
        // emit again
        await new Promise<void>((resolve, reject) => {
            emitter.emit('before.action', eventArgs, function(err: Error) {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
        expect(eventArgs.value).toBe(2);
    });

    it('should use SequentialEventEmitter.subscribeOnce()', async ()=> {
        const emitter = new SequentialEventEmitter();
        emitter.subscribe('before.action', async (event: { value: number }) => {
            event.value += 1;
        });
        emitter.subscribeOnce('before.action', async (event: { value: number }) => {
            event.value += 1;
        });
        let eventArgs = {
            value: 100
        }
        emitter.once('before.action', function(ev, callback) {
            ev.value += 1;
            return callback();
        });
        await emitter.next('before.action', eventArgs);
        expect(eventArgs.value).toBe(103);
        let listenerCount = emitter.listeners('before.action').length;
        expect(listenerCount).toBe(1);
        await emitter.next('before.action', eventArgs);
        expect(eventArgs.value).toBe(103);
        emitter.removeAllListeners('before.action');
        // // reset
        // eventArgs = {
        //     value: 100
        // };
        // emitter.subscribeOnce('before.action', (event: { value: number }) => {
        //     event.value += 5;
        //     return Promise.resolve();
        // });
        // let listenerCount = emitter.listenerCount('before.action');
        // expect(listenerCount).toBe(1);
        // await emitter.next('before.action', eventArgs);
        // expect(eventArgs.value).toBe(105);
        expect(emitter.listenerCount('before.action')).toBe(0);
    });

});
