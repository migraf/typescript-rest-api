/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {FilterOperatorLabel, FiltersParseOptions, FiltersParsed, parseFilters, parseRelations} from "../../src";

describe('src/filter/index.ts', () => {
    it('should transform request filters', () => {
        // filter id
        let allowedFilter = parseFilters({id: 1});
        expect(allowedFilter).toEqual([{
            key: 'id',
            value: 1
        }]  as FiltersParsed);

        // filter none
        allowedFilter = parseFilters({id: 1}, {allowed: []});
        expect(allowedFilter).toEqual([]  as FiltersParsed);

        // filter with alias
        allowedFilter = parseFilters({aliasId: 1}, {aliasMapping: {aliasId: 'id'}, allowed: ['id']});
        expect(allowedFilter).toEqual([{
            key: 'id',
            value: 1
        }] as FiltersParsed);

        // filter with query alias
        allowedFilter = parseFilters({id: 1}, {defaultAlias: 'user', allowed: ['id']});
        expect(allowedFilter).toEqual([{
            alias: 'user',
            key: 'id',
            value: 1
        }] as FiltersParsed);

        // filter allowed
        allowedFilter = parseFilters({name: 'tada5hi'}, {allowed: ['name']});
        expect(allowedFilter).toEqual( [{
            key: 'name',
            value: 'tada5hi'
        }] as FiltersParsed);

        // filter data with el empty value
        allowedFilter = parseFilters({name: ''}, {allowed: ['name']});
        expect(allowedFilter).toEqual([] as FiltersParsed);

        // filter data with el null value
        allowedFilter = parseFilters({name: null}, {allowed: ['name']});
        expect(allowedFilter).toEqual([] as FiltersParsed);

        // filter wrong allowed
        allowedFilter = parseFilters({id: 1}, {allowed: ['name']});
        expect(allowedFilter).toEqual([] as FiltersParsed);

        // filter empty data
        allowedFilter = parseFilters({}, {allowed: ['name']});
        expect(allowedFilter).toEqual([] as FiltersParsed);
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
        const include = parseRelations(['profile', 'user_roles.role']);

        const options : FiltersParseOptions = {
            allowed: ['id', 'profile.id', 'role.id'],
            relations: include,
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
