import {ApplicationService, ApplicationBase,
    ApplicationServiceConstructor, ConfigurationBase} from '../src';
class SampleService extends ApplicationService {
    constructor(app: any) {
        super(app);
    }
}

class SampleApplication implements ApplicationBase {
    configuration: ConfigurationBase;
    useStrategy(serviceCtor: ApplicationServiceConstructor<any>, strategyCtor: ApplicationServiceConstructor<any>): this {
        throw new Error('Method not implemented.');
    }
    useService(serviceCtor: ApplicationServiceConstructor<any>): this {
        throw new Error('Method not implemented.');
    }
    hasService<T>(serviceCtor: ApplicationServiceConstructor<T>): boolean {
        throw new Error('Method not implemented.');
    }
    getService<T>(serviceCtor: ApplicationServiceConstructor<T>): T {
        throw new Error('Method not implemented.');
    }
    getConfiguration(): ConfigurationBase {
        throw new Error('Method not implemented.');
    }


}

describe('ApplicationService', () => {
    it('should create an application service', () => {
        const app = new SampleApplication();
        const service = new SampleService(app);
        expect(service.application).toBeTruthy();
        expect(service.getApplication()).toBeTruthy();
        expect(()=> {
            //@ts-ignore-next-line
            service.application = app;
        }).toThrowError();
    });
});
