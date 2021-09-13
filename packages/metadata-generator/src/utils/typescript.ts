import {join, isAbsolute} from "packages/metadata-generator/src/utils/path";
import {CompilerOptions, convertCompilerOptionsFromJson} from "packages/metadata-generator/src/utils/typescript";

export function getCompilerOptions(tsconfigPath?: string | null): CompilerOptions {
    const cwd = process.cwd();
    tsconfigPath = tsconfigPath ? (isAbsolute(tsconfigPath) ? tsconfigPath : join(cwd, tsconfigPath)): join(cwd, 'tsconfig.json');
    try {
        const tsConfig = require(tsconfigPath);
        if (!tsConfig) {
            throw new Error('Invalid tsconfig');
        }
        return tsConfig.compilerOptions
            ? convertCompilerOptionsFromJson(tsConfig.compilerOptions, cwd).options
            : {};
    } catch (err) {
        if (err.code === 'MODULE_NOT_FOUND') {
            throw Error(`No tsconfig file found at '${tsconfigPath}'`);
        } else if (err.name === 'SyntaxError') {
            throw Error(`Invalid JSON syntax in tsconfig at '${tsconfigPath}': ${err.message}`);
        } else {
            throw Error(`Unhandled error encountered loading tsconfig '${tsconfigPath}': ${err.message}`);
        }
    }
}
