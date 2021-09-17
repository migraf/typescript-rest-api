import {createMetadataGenerator} from "../../../src";

describe('src/utils/factory.ts', () => {
    it('should create metadata generator', () => {
        const generator = createMetadataGenerator({
            entryFile: './test/fake-path'
        });

        expect(generator).toBeDefined();
    });

    it('should skip loading compiler Options', () => {
        let generator = createMetadataGenerator({
            entryFile: './test/fake-path'
        }, {});

        expect(generator).toBeDefined();

        generator = createMetadataGenerator({
            entryFile: './test/fake-path'
        }, false);

        expect(generator).toBeDefined();
    });
})
