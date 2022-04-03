import { ServerApplicationConfiguration } from '../src/ServerApplicationConfiguration';
import { resolve } from 'path';
describe('ServerApplicationConfiguration', () => {

    it('should create instance', () => {
        const configuration = new ServerApplicationConfiguration();
        expect(configuration).toBeTruthy();
    });

    it('should load configuration', () => {
        const env = process.env.NODE_ENV;
        process.env.NODE_ENV = 'test';
        let configuration = new ServerApplicationConfiguration(resolve(__dirname, 'test/config'));
        expect(configuration).toBeTruthy();
        expect(configuration.settings.title).toBeFalsy();

        process.env.NODE_ENV = 'development';
        configuration = new ServerApplicationConfiguration(resolve(__dirname, 'test/config'));
        expect(configuration).toBeTruthy();
        expect(configuration.settings.title).toEqual('Test Application');
        process.env.NODE_ENV = env;
    });

});