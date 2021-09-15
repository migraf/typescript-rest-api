import {normalizePathParameters} from "../../src";

describe('src/path.ts', () => {
    it('should normalize', () => {
        expect(normalizePathParameters(undefined)).toBe(undefined);

        expect(normalizePathParameters('/domains')).toBe('/domains');
        expect(normalizePathParameters('/domains/:id')).toBe('/domains/{id}');
        expect(normalizePathParameters('/domains/<id>')).toBe('/domains/{id}');
        expect(normalizePathParameters('/domains/<:id>')).toBe('/domains/{id}');
    });
});
