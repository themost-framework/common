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

    it('should use SequentialEventEmitter.subscribeOnce()', async ()=> {
        const emitter = new SequentialEventEmitter();
        emitter.subscribe('before.action', (event: { value: number }) => {
            event.value += 1;
            return Promise.resolve();
        });
        emitter.subscribeOnce('before.action', (event: { value: number }) => {
            event.value += 1;
            return Promise.resolve();
        });
        let eventArgs = {
            value: 100
        }
        await emitter.next('before.action', eventArgs);
        expect(eventArgs.value).toBe(102);
        expect(emitter.listenerCount('before.action')).toBe(1);
        emitter.removeAllListeners('before.action');
        // reset
        eventArgs = {
            value: 100
        };
        emitter.subscribeOnce('before.action', (event: { value: number }) => {
            event.value += 5;
            return Promise.resolve();
        });
        expect(emitter.listenerCount('before.action')).toBe(1);
        await emitter.next('before.action', eventArgs);
        expect(eventArgs.value).toBe(105);
        expect(emitter.listenerCount('before.action')).toBe(0);
    });

});
