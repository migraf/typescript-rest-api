import {normalizePath, normalizePathParameters} from "../../src";

describe('src/path.ts', () => {
    it('should normalize path parameters', () => {
        expect(normalizePath('/domains//id/')).toEqual('domains/id');
    });

    it('should normalize path parameters', () => {
        expect(normalizePathParameters('/domains')).toBe('/domains');
        expect(normalizePathParameters('/domains/:id')).toBe('/domains/{id}');
        expect(normalizePathParameters('/domains/<id>')).toBe('/domains/{id}');
        expect(normalizePathParameters('/domains/<:id>')).toBe('/domains/{id}');
    });
});
