import * as fs from "fs";
import * as glob from 'glob';
import * as path from "path";
import {OutputCache} from "../type";
import {CacheConfig} from "./type";
import {buildCacheConfig, buildFileHash} from "./utils";

export class Cache {
    private readonly config : CacheConfig;

    constructor(config: string | boolean | Partial<CacheConfig>) {
        this.config = buildCacheConfig(config);
    }

    // -------------------------------------------------------------------------

    public save(data: OutputCache) : string | undefined {
        if(!this.config.enabled) {
            return undefined;
        }

        const filePath : string = this.buildFilePath(undefined, data.sourceFilesSize);

        fs.writeFileSync(filePath, JSON.stringify(data));

        return filePath;
    }

    public get(sourceFilesSize: number) : OutputCache | undefined {
        if(!this.config.enabled) {
            return undefined;
        }

        this.clear();

        const filePath : string = this.buildFilePath(undefined, sourceFilesSize);

        try {
            const buffer: Buffer = fs.readFileSync(filePath);

            const content: string = buffer.toString('utf-8');

            // todo: maybe add shape validation here :)
            const cache : OutputCache | undefined = JSON.parse(content) as OutputCache;

            if (typeof cache === 'undefined' || cache.sourceFilesSize !== sourceFilesSize) {
                return undefined;
            }

            return cache;
        } catch (e) {
            /* istanbul ignore next */
            return undefined;
        }
    }

    // -------------------------------------------------------------------------

    /**
     * At a 10% chance, clear all cache files :)
     */
    /* istanbul ignore next */
    public clear() : void {
        if(!this.config.enabled || !this.config.clearAtRandom) {
            return;
        }

        const rand : number = Math.floor(Math.random() * 100) + 1;
        if(rand > 10) {
            return;
        }

        const files : string[] = glob.sync(this.buildFilePath('**'));
        files.map(file => fs.unlinkSync(file));
    }

    // -------------------------------------------------------------------------

    private buildFilePath(hash?: string, sourceFilesSize?: number) : string {
        return path.join(this.config.directoryPath, this.buildFileName(hash, sourceFilesSize));
    }

    private buildFileName(hash?: string, sourceFilesSize?: number) : string {
        if(typeof this.config.fileName === 'string') {
            return this.config.fileName;
        } else {
            return `.swagger-${hash ?? buildFileHash(sourceFilesSize)}.json`;
        }
    }
}

