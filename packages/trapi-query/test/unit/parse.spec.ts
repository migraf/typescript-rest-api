/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {parseQuery, QueryParseOutput, QueryKey} from "../../src";

describe('src/parse.ts', function () {
    it('should parse query', () => {
        let value = parseQuery({
            fields: ['id', 'name']
        },{
            [QueryKey.FIELDS]: true
        });

        expect(value).toEqual({
            [QueryKey.FIELDS]: [
                {key: 'id'},
                {key: 'name'}
            ]} as QueryParseOutput);

        value = parseQuery({
            [QueryKey.FIELDS]: ['id', 'name']
        });

        expect(value).toEqual({
            [QueryKey.FIELDS]: [
                {key: "id"},
                {key: "name"}
            ],
            [QueryKey.FILTER]: [],
            [QueryKey.INCLUDE]: [],
            [QueryKey.PAGE]: {},
            [QueryKey.SORT]: {}
        } as QueryParseOutput);
    })
});
