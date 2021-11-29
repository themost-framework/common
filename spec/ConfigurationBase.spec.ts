import {ConfigurationBase} from '../src';

class ServiceType {
    get server() {
        return 'http://localhost:8080'
    }
}

class StrategyType {
    get server() {
        return 'http://api.example.com'
    }
}

describe('ConfigurationBase', () => {

    it('should create instance', ()=> {
       const configuration = new ConfigurationBase();
       expect(configuration).toBeTruthy();
    });

    it('should use ConfigurationBase.hasStrategy()', ()=> {
        const configuration = new ConfigurationBase();
        expect(configuration.hasStrategy(ServiceType)).toBeFalsy();
        configuration.useStrategy(ServiceType);
        expect(configuration.hasStrategy(ServiceType)).toBeTruthy();
    });

    it('should use ConfigurationBase.getStrategy()', ()=> {
        const configuration = new ConfigurationBase();
        configuration.useStrategy(ServiceType);

        let service = configuration.getStrategy(ServiceType);
        expect(service).toBeTruthy();
        expect(service.server).toBe('http://localhost:8080');

        configuration.useStrategy(ServiceType, StrategyType);
        service = configuration.getStrategy(ServiceType);
        expect(service).toBeTruthy();
        expect(service.server).toBe('http://api.example.com');
    });

    it('should use ConfigurationBase.getSource()', ()=> {
        const configuration = new ConfigurationBase();
        const source = configuration.getSource();
        expect(source).toEqual({ settings: {} });
        configuration.setSourceAt('settings/app/title', 'Test Application');
        expect(source).toEqual({
            settings: {
                app: {
                    title: 'Test Application'
                }
            }
        });
    });

    it('should use ConfigurationBase.getSourceAt()', ()=> {
        const configuration = new ConfigurationBase();
        const source = configuration.getSource();
        expect(source).toEqual({ settings: {} });
        configuration.setSourceAt('settings/app/title', 'Test Application');
        expect(configuration.getSourceAt('settings/app/title')).toBe('Test Application');
    });

    it('should use ConfigurationBase.setSourceAt()', ()=> {
        const configuration = new ConfigurationBase();
        const source = configuration.getSource();
        expect(source).toEqual({ settings: {} });
        configuration.setSourceAt('settings/app/title', 'Test Application');
        expect(configuration.getSourceAt('settings/app/title')).toBe('Test Application');
        configuration.setSourceAt('settings/app/title', 'Another Application');
        expect(configuration.getSourceAt('settings/app/title')).toBe('Another Application');
    });

});
