import {Guid} from '../utils';

describe('Guid', () => {
    it('should create guid from string', () => {
        let guid = Guid.from('test');
        expect(guid).toBeTruthy();
        expect(guid.toString()).toBeTruthy();
        guid = Guid.from('NC-0034-01');
        expect(guid.toString()).toEqual('1128a976-6e41-2169-c7d0-4ced1f46b035');
    });
});
