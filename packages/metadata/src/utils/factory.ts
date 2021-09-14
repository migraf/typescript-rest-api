import {CompilerOptions} from 'typescript';
import {Config} from "../type";
import {Generator} from "../generator";
import {getCompilerOptions} from "@trapi/utils";

export function createMetadataGenerator(
    config: Config,
    compilerOptions?: CompilerOptions | boolean
): Generator {
    const skipLoad: boolean =
        (typeof compilerOptions === 'boolean' && !compilerOptions) ||
        (typeof compilerOptions !== 'boolean' && typeof compilerOptions !== 'undefined');

    let tscConfig: CompilerOptions = typeof compilerOptions !== 'boolean' && typeof compilerOptions !== 'undefined' ? compilerOptions : {};

    if (!skipLoad) {
        try {
            tscConfig ??= getCompilerOptions();
        } catch (e) {
            tscConfig = {};
        }
    }

    return new Generator(config, tscConfig);
}
