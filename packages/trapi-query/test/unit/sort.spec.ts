/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {parseRelations, parseSort, SortDirection, SortParseOptions, SortParsed} from "../../src";

describe('src/sort/index.ts', () => {
    it('should transform sort data', () => {
        // sort asc
        let transformed = parseSort('id', {allowed: ['id']});
        expect(transformed).toEqual([{key: 'id', value: SortDirection.ASC}]as SortParsed);

        // sort desc
        transformed = parseSort('-id', {allowed: ['id']});
        expect(transformed).toEqual([{key: 'id', value: SortDirection.DESC}]as SortParsed);

        // empty allowed
        transformed = parseSort('-id', {allowed: []});
        expect(transformed).toEqual([] as SortParsed);

        // undefined allowed
        transformed = parseSort('-id', {allowed: undefined});
        expect(transformed).toEqual([{key: 'id', value: SortDirection.DESC}]as SortParsed);

        // wrong allowed
        transformed = parseSort('-id', {allowed: ['a']});
        expect(transformed).toEqual([] as SortParsed);

        // array data
        transformed = parseSort(['-id'], {allowed: ['id']});
        expect(transformed).toEqual([{key: 'id', value: SortDirection.DESC}]as SortParsed);

        // object data
        transformed = parseSort({id: 'ASC'}, {allowed: ['id']});
        expect(transformed).toEqual([{key: 'id', value: SortDirection.ASC}]as SortParsed);

        // wrong input data data
        transformed = parseSort({id: 'Right'}, {allowed: ['id']});
        expect(transformed).toEqual([{key: 'id', value: SortDirection.ASC}]as SortParsed);

        // with query alias
        transformed = parseSort('-id',  {allowed: ['id'], defaultAlias: 'user'});
        expect(transformed).toEqual([{alias: 'user', key: 'id', value: SortDirection.DESC}]as SortParsed);

        // with alias mapping
        transformed = parseSort('-pit',  {aliasMapping: {pit: 'id'}, allowed: ['id']});
        expect(transformed).toEqual([{key: 'id', value: SortDirection.DESC}] as SortParsed);

        // with alias mapping & query alias
        transformed = parseSort('-pit', {aliasMapping: {pit: 'id'}, allowed: ['id'], defaultAlias: 'user'});
        expect(transformed).toEqual([{alias: 'user', key: 'id', value: SortDirection.DESC}]as SortParsed);
    });

    it('should transform sort with sort indexes', () => {
        const options : SortParseOptions = {
            allowed: [
                ['name', 'email'],
                ['id']
            ]
        };

        // simple
        let transformed = parseSort(['id'], options);
        expect(transformed).toEqual([{key: 'id', value: SortDirection.ASC}]as SortParsed);

        // correct order
        transformed = parseSort(['name', 'email'], options);
        expect(transformed).toStrictEqual([
            {key: 'name', value: SortDirection.ASC},
            {key: 'email', value: SortDirection.ASC}
        ]as SortParsed);

        // incorrect order
        transformed = parseSort(['email', 'name'], options);
        expect(transformed).toStrictEqual([
            {key: 'name', value: SortDirection.ASC},
            {key: 'email', value: SortDirection.ASC}
        ]as SortParsed);

        // incomplete match
        transformed = parseSort(['email', 'id'], options);
        expect(transformed).toStrictEqual([
            {key: 'id', value: SortDirection.ASC},
        ]as SortParsed);

        // no match
        transformed = parseSort(['email'], options);
        expect(transformed).toStrictEqual([]);
    });

    it('should transform sort data with includes', () => {
        const includes = parseRelations(['profile', 'user_roles.role']);

        const options : SortParseOptions = {
            allowed: ['id', 'profile.id', 'user_roles.role.id'],
            relations: includes,
        };

        // simple
        let transformed = parseSort(['id'], options);
        expect(transformed).toEqual([
            {key: 'id', value: SortDirection.ASC}
        ]as SortParsed);

        // with query alias
        transformed = parseSort(['id'], {...options, defaultAlias: 'user'});
        expect(transformed).toEqual([
            {alias: 'user', key: 'id', value: SortDirection.ASC},
        ]as SortParsed);

        // with include
        transformed = parseSort(['id', 'profile.id'], options);
        expect(transformed).toEqual([
            {key: 'id', value: SortDirection.ASC},
            {alias: 'profile', key: 'id', value: SortDirection.ASC}
        ]as SortParsed);

        // with include & query alias
        transformed = parseSort(['id', 'profile.id'], {...options, defaultAlias: 'user'});
        expect(transformed).toEqual([
            {alias: 'user', key: 'id', value: SortDirection.ASC},
            {alias: 'profile', key: 'id', value: SortDirection.ASC}
        ]as SortParsed);

        // with deep nested include
        transformed = parseSort(['id', 'user_roles.role.id', 'user_roles.user.id'], options);
        expect(transformed).toEqual([
            {key: 'id', value: SortDirection.ASC},
            {alias: 'role', key: 'id', value: SortDirection.ASC}
        ]as SortParsed);
    });
});
