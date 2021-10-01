/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {parseIncludes, parseSort, SortOptions} from "../../src";

describe('src/sort/index.ts', () => {
    it('should transform sort data', () => {
        // sort asc
        let transformed = parseSort('id', {allowed: ['id']});
        expect(transformed).toEqual({id: 'ASC'});

        // sort desc
        transformed = parseSort('-id', {allowed: ['id']});
        expect(transformed).toEqual({id: 'DESC'});

        // empty allowed
        transformed = parseSort('-id', {allowed: []});
        expect(transformed).toEqual({});

        // undefined allowed
        transformed = parseSort('-id', {allowed: undefined});
        expect(transformed).toEqual({id: 'DESC'});

        // wrong allowed
        transformed = parseSort('-id', {allowed: ['a']});
        expect(transformed).toEqual({});

        // array data
        transformed = parseSort(['-id'], {allowed: ['id']});
        expect(transformed).toEqual({id: 'DESC'});

        // object data
        transformed = parseSort({id: 'ASC'}, {allowed: ['id']});
        expect(transformed).toEqual({id: 'ASC'});

        // wrong input data data
        transformed = parseSort({id: 'Right'}, {allowed: ['id']});
        expect(transformed).toEqual({id: 'ASC'});

        // with query alias
        transformed = parseSort('-id',  {allowed: ['id'], queryAlias: 'user'});
        expect(transformed).toEqual({'user.id': 'DESC'});

        // with alias mapping
        transformed = parseSort('-pit',  {aliasMapping: {pit: 'id'}, allowed: ['id']});
        expect(transformed).toEqual({'id': 'DESC'});

        // with alias mapping & query alias
        transformed = parseSort('-pit', {aliasMapping: {pit: 'id'}, allowed: ['id'], queryAlias: 'user'});
        expect(transformed).toEqual({'user.id': 'DESC'});
    });

    it('should transform sort with sort indexes', () => {
        const options : SortOptions = {
            allowed: [
                ['name', 'email'],
                ['id']
            ]
        };

        // simple
        let transformed = parseSort(['id'], options);
        expect(transformed).toEqual({id: 'ASC'});

        // correct order
        transformed = parseSort(['name', 'email'], options);
        expect(transformed).toStrictEqual({name: 'ASC', email: 'ASC'});

        // incorrect order
        transformed = parseSort(['email', 'name'], options);
        expect(transformed).toStrictEqual({name: 'ASC', email: 'ASC'});

        // incomplete match
        transformed = parseSort(['email', 'id'], options);
        expect(transformed).toStrictEqual({id: 'ASC'});

        // no match
        transformed = parseSort(['email'], options);
        expect(transformed).toStrictEqual({});
    });

    it('should transform sort data with includes', () => {
        const includes = parseIncludes(['profile', 'user_roles.role']);

        const options : SortOptions = {
            allowed: ['id', 'profile.id', 'user_roles.role.id'],
            includes: includes,
        };

        // simple
        let transformed = parseSort(['id'], options);
        expect(transformed).toEqual({id: 'ASC'});

        // with query alias
        transformed = parseSort(['id'], {...options, queryAlias: 'user'});
        expect(transformed).toEqual({'user.id': 'ASC'});

        // with include
        transformed = parseSort(['id', 'profile.id'], options);
        expect(transformed).toEqual({'id': 'ASC', 'profile.id': 'ASC'});

        // with include & query alias
        transformed = parseSort(['id', 'profile.id'], {...options, queryAlias: 'user'});
        expect(transformed).toEqual({'user.id': 'ASC', 'profile.id': 'ASC'});

        // with include
        transformed = parseSort(['id', 'profile.id'], options);
        expect(transformed).toEqual({'id': 'ASC', 'profile.id': 'ASC'});

        // with deep nested include
        transformed = parseSort(['id', 'user_roles.role.id', 'user_roles.user.id'], options);
        expect(transformed).toEqual({'id': 'ASC', 'role.id': 'ASC'});
    });
});
