import * as crypto from "crypto";
import * as fs from "fs";
import * as glob from 'glob';
import * as path from "path";
import {Config, OutputCache} from "../type";

export class MetadataCache {
    private readonly config : Config;

    constructor(config: Config) {
        this.config = config;
    }

    // -------------------------------------------------------------------------

    public save(data: OutputCache) : string | undefined {
        if(!this.isEnabled()) {
            return undefined;
        }

        const filePath : string = this.buildFilePath();

        fs.writeFileSync(filePath, JSON.stringify(data));

        return filePath;
    }

    public get(sourceFilesSize: number) : OutputCache | undefined {
        if(!this.isEnabled()) {
            return undefined;
        }

        this.clear();

        const filePath : string = this.buildFilePath();

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
        if(!this.isEnabled()) {
            return;
        }

        const rand : number = Math.floor(Math.random() * 100) + 1;
        if(rand > 10) {
            return;
        }

        const files : string[] = glob.sync(this.buildFilePath('**'));
        files.map(file => fs.unlinkSync(file));
    }

    public isEnabled() : boolean {
        return typeof this.config.cache === 'string' || (typeof this.config.cache === 'boolean' && !!this.config.cache);
    }

    private buildFilePath(hash?: string) : string {
        return path.join(this.buildDirectoryPath(), `.swagger-${hash ?? this.buildFileHash()}.json`);
    }

    private buildDirectoryPath() : string {
        return typeof this.config.cache === 'string' ?
            path.isAbsolute(this.config.cache) ? this.config.cache : path.join(process.cwd(), this.config.cache) :
            process.cwd();
    }

    private buildFileHash() : string {
        const files : string[] = Array.isArray(this.config.entryFile) ? this.config.entryFile : [this.config.entryFile];
        const hash = crypto.createHash('sha256');

        files.map(file => hash.update(file));

        return hash.digest('hex');
    }
}
