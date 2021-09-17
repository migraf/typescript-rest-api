import {MetadataCache} from "../../src";
import path from "path";
import {getWritableDirPath} from "../../src/config";
import * as fs from "fs";

describe('src/cache/index.ts', function () {
    it('should save cache', () => {
        const cache = new MetadataCache({
            entryFile: ['./test/data/library/self.ts'],
            cache: getWritableDirPath(),
        });

        const cachePath : string = cache.save({
            controllers: [],
            referenceTypes: {},
            sourceFilesSize: 0
        });

        expect(cachePath).toBeDefined();
        expect(fs.existsSync(cachePath)).toBeTruthy();

        const output = cache.get(0);

        expect(output).toBeDefined();
        expect(output).toHaveProperty('controllers');
        expect(output).toHaveProperty('referenceTypes');
        expect(output).toHaveProperty('sourceFilesSize');
    });

    it('should not save & get cache', () => {
        const cacheNone = new MetadataCache({
            entryFile: ['./test/data/library/self.ts'],
            cache: false
        });

        const cachePath : string = cacheNone.save({
            controllers: [],
            referenceTypes: {},
            sourceFilesSize: 0
        });

        expect(cachePath).toBeUndefined();

        const output = cacheNone.get(0);

        expect(output).toBeUndefined();
    });
});
