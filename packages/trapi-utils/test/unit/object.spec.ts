import {hasOwnProperty} from "../../src";

describe('src/object.ts', () => {
    it('should determine if property exist', () => {
        const ob : Record<string, any> = {
            foo: 'bar'
        };

        expect(hasOwnProperty(ob, 'foo')).toBeTruthy();
        expect(hasOwnProperty(ob, 'bar')).toBeFalsy();
    });
});
