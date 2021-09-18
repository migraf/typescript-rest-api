import {CacheConfig} from "./type";
import path from "path";
import crypto from "crypto";

export function buildCacheConfig(config?: string | boolean | Partial<CacheConfig>) : CacheConfig {
    if(typeof config === 'string') {
        config = {
            enabled: true,
            directoryPath: config
        }
    }

    if(typeof config === 'boolean') {
        config = {
            enabled: config
        }
    }

    config ??= {};

    let data : CacheConfig = {
        directoryPath: "",
        enabled: false,
        clearAtRandom: config.clearAtRandom ?? true
    };

    data.enabled = config.enabled ?? false;
    data.fileName = config.fileName;
    data.directoryPath = typeof config.directoryPath === 'string' ?
        path.isAbsolute(config.directoryPath) ? config.directoryPath : path.join(process.cwd(), config.directoryPath) :
        process.cwd();

    return data;
}

export function buildFileHash(sourceFilesSize?: number): string {
    const hash = crypto.createHash('sha256');

    const strSize: string = (sourceFilesSize ?? 0).toString();

    hash.update(strSize);

    return hash.digest('hex');
}
