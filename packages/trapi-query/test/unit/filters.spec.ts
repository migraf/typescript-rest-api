/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {FilterOperatorLabel, FiltersOptions, FiltersParsed, parseFilters, parseIncludes} from "../../src";

describe('src/filters/index.ts', () => {
    it('should transform request filters', () => {
        // filter id
        let allowedFilters = parseFilters({id: 1});
        expect(allowedFilters).toEqual([{
            key: 'id',
            value: 1
        }]  as FiltersParsed);

        // filter none
        allowedFilters = parseFilters({id: 1}, {allowed: []});
        expect(allowedFilters).toEqual([]  as FiltersParsed);

        // filter with alias
        allowedFilters = parseFilters({aliasId: 1}, {aliasMapping: {aliasId: 'id'}, allowed: ['id']});
        expect(allowedFilters).toEqual([{
            key: 'id',
            value: 1
        }] as FiltersParsed);

        // filter with query alias
        allowedFilters = parseFilters({id: 1}, {defaultAlias: 'user', allowed: ['id']});
        expect(allowedFilters).toEqual([{
            alias: 'user',
            key: 'id',
            value: 1
        }] as FiltersParsed);

        // filter allowed
        allowedFilters = parseFilters({name: 'tada5hi'}, {allowed: ['name']});
        expect(allowedFilters).toEqual( [{
            key: 'name',
            value: 'tada5hi'
        }] as FiltersParsed);

        // filter data with el empty value
        allowedFilters = parseFilters({name: ''}, {allowed: ['name']});
        expect(allowedFilters).toEqual([] as FiltersParsed);

        // filter data with el null value
        allowedFilters = parseFilters({name: null}, {allowed: ['name']});
        expect(allowedFilters).toEqual([] as FiltersParsed);

        // filter wrong allowed
        allowedFilters = parseFilters({id: 1}, {allowed: ['name']});
        expect(allowedFilters).toEqual([] as FiltersParsed);

        // filter empty data
        allowedFilters = parseFilters({}, {allowed: ['name']});
        expect(allowedFilters).toEqual([] as FiltersParsed);
    });

    it('should transform filters with different operators', () => {
        // equal operator
        let data = parseFilters({id: '1'}, {allowed: ['id']});
        expect(data).toEqual([
            {
                key: 'id',
                value: '1'
            }
        ] as FiltersParsed);

        // negation with equal operator
        data = parseFilters({id: '!1'}, {allowed: ['id']});
        expect(data).toEqual([
            {
                key: 'id',
                operator: {
                    [FilterOperatorLabel.NEGATION]: true
                },
                value: '1'
            }
        ] as FiltersParsed);

        // in operator
        data = parseFilters({id: '1,2,3'}, {allowed: ['id']});
        expect(data).toEqual([
            {
                key: 'id',
                operator: {
                    [FilterOperatorLabel.IN]: true
                },
                value: ["1", "2", "3"]
            }
        ] as FiltersParsed);

        // negation with in operator
        data = parseFilters({id: '!1,2,3'}, {allowed: ['id']});
        expect(data).toEqual([
            {
                key: 'id',
                operator: {
                    [FilterOperatorLabel.IN]: true,
                    [FilterOperatorLabel.NEGATION]: true
                },
                value: ["1", "2", "3"]
            }
        ] as FiltersParsed);

        // like operator
        data = parseFilters({name: '~name'}, {allowed: ['name']});
        expect(data).toEqual([
            {
                key: 'name',
                operator: {
                    [FilterOperatorLabel.LIKE]: true
                },
                value: "name"
            }
        ] as FiltersParsed);

        // negation with like operator
        data = parseFilters({name: '!~name'}, {allowed: ['name']});
        expect(data).toEqual([
            {
                key: 'name',
                operator: {
                    [FilterOperatorLabel.LIKE]: true,
                    [FilterOperatorLabel.NEGATION]: true
                },
                value: "name"
            }
        ] as FiltersParsed);
    });

    it('should transform filters with includes', () => {
        const includes = parseIncludes(['profile', 'user_roles.role']);

        const options : FiltersOptions = {
            allowed: ['id', 'profile.id', 'role.id'],
            includes: includes,
        };

        // simple
        let transformed = parseFilters({id: 1, 'profile.id': 2}, options);
        expect(transformed).toEqual([
            {
                key: 'id',
                value: 1
            },
            {
                alias: 'profile',
                key: 'id',
                value: 2
            }
        ] as FiltersParsed);

        // with include & query alias
        transformed = parseFilters({id: 1, 'profile.id': 2}, {...options, defaultAlias: 'user'});
        expect(transformed).toEqual([
            {
                alias: 'user',
                key: 'id',
                value: 1
            },
            {
                alias: 'profile',
                key: 'id',
                value: 2
            }
        ] as FiltersParsed);

        // with deep nested include
        transformed = parseFilters({id: 1, 'role.id': 2}, options);
        expect(transformed).toEqual([
            {
                key: 'id',
                value: 1
            },
            {
                alias: 'role',
                key: 'id',
                value: 2
            }
        ] as FiltersParsed);
    });
});
