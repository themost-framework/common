import { ServerConfigurationBase } from '../src';
import { resolve } from 'path';
describe('ServerConfigurationBase', () => {

    it('should create instance', () => {
        const configuration = new ServerConfigurationBase();
        expect(configuration).toBeTruthy();
    });

    it('should load configuration', () => {
        const env = process.env.NODE_ENV;
        process.env.NODE_ENV = 'test';
        let configuration = new ServerConfigurationBase(resolve(__dirname, 'test/config'));
        expect(configuration).toBeTruthy();
        expect(configuration.settings.title).toBeFalsy();

        process.env.NODE_ENV = 'development';
        configuration = new ServerConfigurationBase(resolve(__dirname, 'test/config'));
        expect(configuration).toBeTruthy();
        expect(configuration.settings.title).toEqual('Test Application');
        process.env.NODE_ENV = env;
    });

});