/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {FiltersOptions, FiltersTransformed, parseFilters, parseIncludes} from "../../src";

describe('src/filters/index.ts', () => {
    it('should transform request filters', () => {
        // filter id
        let allowedFilters = parseFilters({id: 1});
        expect(allowedFilters).toEqual([{statement: 'id = :filter_id', binding: {'filter_id': 1}}]  as FiltersTransformed);

        // filter none
        allowedFilters = parseFilters({id: 1}, {allowed: []});
        expect(allowedFilters).toEqual([]  as FiltersTransformed);

        // filter with alias
        allowedFilters = parseFilters({aliasId: 1}, {aliasMapping: {aliasId: 'id'}, allowed: ['id']});
        expect(allowedFilters).toEqual([{statement: 'id = :filter_id', binding: {'filter_id': 1}}] as FiltersTransformed);

        // filter with custom queryBindingKey
        allowedFilters = parseFilters({id: 1}, {allowed: ['id'], queryBindingKeyFn: key => key});
        expect(allowedFilters).toEqual([{statement: 'id = :id', binding: {'id': 1}}] as FiltersTransformed);

        // filter with query alias
        allowedFilters = parseFilters({id: 1}, {queryAlias: 'user', allowed: ['id']});
        expect(allowedFilters).toEqual([{statement: 'user.id = :filter_user_id', binding: {'filter_user_id': 1}}] as FiltersTransformed);

        // filter allowed
        allowedFilters = parseFilters({name: 'tada5hi'}, {allowed: ['name']});
        expect(allowedFilters).toEqual( [{statement: 'name = :filter_name', binding: {'filter_name': 'tada5hi'}}] as FiltersTransformed);

        // filter data with el empty value
        allowedFilters = parseFilters({name: ''}, {allowed: ['name']});
        expect(allowedFilters).toEqual([] as FiltersTransformed);

        // filter data with el null value
        allowedFilters = parseFilters({name: null}, {allowed: ['name']});
        expect(allowedFilters).toEqual([] as FiltersTransformed);

        // filter wrong allowed
        allowedFilters = parseFilters({id: 1}, {allowed: ['name']});
        expect(allowedFilters).toEqual([] as FiltersTransformed);

        // filter empty data
        allowedFilters = parseFilters({}, {allowed: ['name']});
        expect(allowedFilters).toEqual([] as FiltersTransformed);
    });

    it('should transform filters with different operators', () => {
        // equal operator
        let data = parseFilters({id: '1'}, {allowed: ['id']});
        expect(data).toEqual([
            {statement: 'id = :filter_id', binding: {'filter_id': '1'}}
        ] as FiltersTransformed);

        // negation with equal operator
        data = parseFilters({id: '!1'}, {allowed: ['id']});
        expect(data).toEqual([
            {statement: 'id != :filter_id', binding: {'filter_id': '1'}}
        ] as FiltersTransformed);

        // in operator
        data = parseFilters({id: '1,2,3'}, {allowed: ['id']});
        expect(data).toEqual([
            {statement: 'id IN (:...filter_id)', binding: {'filter_id': ["1","2","3"]}}
        ] as FiltersTransformed);

        // negation with in operator
        data = parseFilters({id: '!1,2,3'}, {allowed: ['id']});
        expect(data).toEqual([
            {statement: 'id NOT IN (:...filter_id)', binding: {'filter_id': ["1","2","3"]}}
        ] as FiltersTransformed);

        // like operator
        data = parseFilters({name: '~name'}, {allowed: ['name']});
        expect(data).toEqual([
            {statement: 'name LIKE :filter_name', binding: {'filter_name': 'name%'}}
        ] as FiltersTransformed);

        // negation with like operator
        data = parseFilters({name: '!~name'}, {allowed: ['name']});
        expect(data).toEqual([
            {statement: 'name NOT LIKE :filter_name', binding: {'filter_name': 'name%'}}
        ] as FiltersTransformed);
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
            {statement: 'id = :filter_id', binding: {'filter_id': 1}},
            {statement: 'profile.id = :filter_profile_id', binding: {'filter_profile_id': 2}}
        ] as FiltersTransformed);

        // with include & query alias
        transformed = parseFilters({id: 1, 'profile.id': 2}, {...options, queryAlias: 'user'});
        expect(transformed).toEqual([
            {statement: 'user.id = :filter_user_id', binding: {'filter_user_id': 1}},
            {statement: 'profile.id = :filter_profile_id', binding: {'filter_profile_id': 2}}
        ] as FiltersTransformed);

        // with deep nested include
        transformed = parseFilters({id: 1, 'role.id': 2}, options);
        expect(transformed).toEqual([
            {statement: 'id = :filter_id', binding: {'filter_id': 1}},
            {statement: 'role.id = :filter_role_id', binding: {'filter_role_id': 2}}
        ] as FiltersTransformed);
    });
});
