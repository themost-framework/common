import {LangUtils} from '../src';

describe('LangUtils', () => {
    it('should use extend', () => {
        const object = {};
        let result = LangUtils.extend(object, 'item[enabled]', 'true');
        expect(result.item).toBeTruthy();
        expect(result.item.enabled).toBeTruthy();
        result = LangUtils.extend(object, 'item[actionStatus][alternateName]', 'active');
        expect(result.item.actionStatus).toBeTruthy();
        expect(result.item.actionStatus.alternateName).toBeTruthy();
    });

    it('should use convert', () => {
        let result = LangUtils.convert('true');
        expect(result).toBeTruthy();
        result = LangUtils.convert('400');
        expect(result).toEqual(400);
        result = LangUtils.convert('4.75');
        expect(result).toEqual(4.75);
        result = LangUtils.convert('2022-01-15');
        expect(result).toBeInstanceOf(Date)
    });

    it('should parse boolean', () => {
        let result = LangUtils.parseBoolean('true');
        expect(result).toBeTruthy();
        result = LangUtils.parseBoolean('yes');
        expect(result).toBeTruthy();
        result = LangUtils.parseBoolean('on');
        expect(result).toBeTruthy();
        result = LangUtils.parseBoolean('no');
        expect(result).toBeFalsy();
        result = LangUtils.parseBoolean('off');
        expect(result).toBeFalsy();
    });

    it('should parse float', () => {
        const result = LangUtils.parseFloat('9.6');
        expect(result).toEqual(9.6);
    });

    it('should parse int', () => {
        const result = LangUtils.parseInt('750');
        expect(result).toEqual(750);
    });
});
