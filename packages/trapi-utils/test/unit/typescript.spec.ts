import {getCompilerOptions} from "../../src";
import path from "path";

describe('src/typescript.ts', () => {
    it('should get compiler options', () => {
        // with file name specified
        let compilerOptions = getCompilerOptions( './test/data/tsconfig.json');
        expect(compilerOptions).toBeDefined();
        expect(compilerOptions.allowJs).toBeTruthy();

        // with no filename specified
        compilerOptions = getCompilerOptions( './test/data');
        expect(compilerOptions).toBeDefined();
        expect(compilerOptions.allowJs).toBeTruthy();

        // with absolute path
        compilerOptions = getCompilerOptions(path.join(process.cwd(), 'test/data'));
        expect(compilerOptions).toBeDefined();
        expect(compilerOptions.allowJs).toBeTruthy();

        // with non-existing fileName or filePath
        expect(() => getCompilerOptions('./test/data', 'non-existing-tsconfig.json')).toThrow();
        expect(() => getCompilerOptions('./test/data/non-existing/tsconfig.json')).toThrow();
    });
});
