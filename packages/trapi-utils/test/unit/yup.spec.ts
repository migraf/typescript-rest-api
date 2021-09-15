import {mapYupRuleForDictionary} from "../../src";

describe('src/yup.ts', () => {
    it('map yup rule for dictionary', () => {
        const dict : Record<string, any> = {
            foo: 'bar'
        };

        expect(mapYupRuleForDictionary(dict, 'baz')).toEqual({foo: 'baz'});
        expect(mapYupRuleForDictionary({}, 'baz')).toEqual({});
        expect(mapYupRuleForDictionary(undefined, 'baz')).toEqual({});
    });
});
