/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */


import {parsePagination} from "../../src";

describe('src/pagination/index.ts', () => {
    it('should transform pagination', () => {
        let pagination = parsePagination(undefined, {maxLimit: 50});
        expect(pagination).toEqual({offset: 0, limit: 50});

        pagination = parsePagination(undefined, undefined);
        expect(pagination).toEqual({});

        pagination = parsePagination( {limit: 100}, {maxLimit: 50});
        expect(pagination).toEqual({offset: 0, limit: 50});

        pagination = parsePagination( {limit: 50}, {maxLimit: 50});
        expect(pagination).toEqual({offset: 0, limit: 50});

        pagination = parsePagination( {offset: 20, limit: 20}, {maxLimit: 50});
        expect(pagination).toEqual({offset: 20, limit: 20});
    });
});
