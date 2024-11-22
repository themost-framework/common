import {Guid} from '@themost/common';

describe('Guid', () => {
    it('should create guid from string', () => {
        let guid = Guid.from('test');
        expect(guid).toBeTruthy();
        expect(guid.toString()).toBeTruthy();
        guid = Guid.from('NC-0034-01');
        expect(guid.toString()).toEqual('1128a976-6e41-2169-c7d0-4ced1f46b035');
        guid = Guid.from(String(15.450));
        expect(guid.toString()).toEqual('5b4db914-fd24-6bba-c859-67348632477b');
    });
});
