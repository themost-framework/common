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
});
