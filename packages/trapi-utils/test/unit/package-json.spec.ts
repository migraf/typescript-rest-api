import path from "path";
import {getPackageJsonStringValue} from "../../src";

describe('src/package-json.ts', () => {
    it('should get package json string value', () => {
        const cwd = process.cwd();
        const configPath = path.join(cwd, './test/data/');

        expect(getPackageJsonStringValue(configPath, 'name')).toBe('@trapi/utils');
        expect(getPackageJsonStringValue(configPath, 'foo')).toBe('');
        expect(getPackageJsonStringValue(configPath, 'foo', 'bar')).toBe('bar');

        const nonExistingPath : string = path.join(configPath, 'non-existing');


        expect(getPackageJsonStringValue(nonExistingPath, 'foo')).toBe('');
        expect(getPackageJsonStringValue(nonExistingPath, 'foo', 'bar')).toBe('bar');
    });
});
