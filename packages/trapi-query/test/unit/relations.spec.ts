/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {RelationsParsed, parseRelations} from "../../src";

describe('src/relations/index.ts', () => {
    it('should transform request relations', () => {
        // single data matching
        let allowed = parseRelations('profile', {allowed: ['profile']});
        expect(allowed).toEqual([
            {key: 'profile', value: 'profile'}
        ]);

        allowed = parseRelations([], {allowed: ['profile']});
        expect(allowed).toEqual([]);

        // with alias
        allowed = parseRelations('pro', {aliasMapping: {pro: 'profile'}, allowed: ['profile']});
        expect(allowed).toEqual([
            {key: 'profile', value: 'profile'}
        ]);

        // with nested alias
        allowed = parseRelations(['abc.photos'], {
            allowed: ['profile.photos'],
            defaultAlias: 'user',
            aliasMapping: {'abc.photos': 'profile.photos'}
        });
        expect(allowed).toEqual([
            {key: 'user.profile', value: 'profile'},
            {key: 'profile.photos', value: 'photos'}
        ] as RelationsParsed);

        // with nested alias & includeParents
        allowed = parseRelations(['abc.photos'], {
            allowed: ['profile.photos'],
            defaultAlias: 'user',
            aliasMapping: {'abc.photos': 'profile.photos'},
            includeParents: false
        });
        expect(allowed).toEqual([
            {key: 'profile.photos', value: 'photos'}
        ] as RelationsParsed);

        // with nested alias & limited includeParents ( no user_roles rel)
        allowed = parseRelations(['abc.photos', 'user_roles.role'], {
            allowed: ['profile.photos', 'user_roles.role'],
            defaultAlias: 'user',
            aliasMapping: {'abc.photos': 'profile.photos'},
            includeParents: ['profile.**']
        });
        expect(allowed).toEqual([
            {key: 'user.profile', value: 'profile'},
            {key: 'profile.photos', value: 'photos'},
            {key: 'user_roles.role', value: 'role'}
        ] as RelationsParsed);


        // multiple data matching
        allowed = parseRelations(['profile', 'abc'], {allowed: ['profile']});
        expect(allowed).toEqual([{key: 'profile', value: 'profile'}] as RelationsParsed);

        // no allowed
        allowed = parseRelations(['profile'], {allowed: []});
        expect(allowed).toEqual([] as RelationsParsed);

        // all allowed
        allowed = parseRelations(['profile'], {allowed: undefined});
        expect(allowed).toEqual([{key: 'profile', value: 'profile'}] as RelationsParsed);

        // nested data with alias
        allowed = parseRelations(['profile.photos', 'profile.photos.abc', 'profile.abc'], {allowed: ['profile.photos'], defaultAlias: 'user'});
        expect(allowed).toEqual([
            {key: 'user.profile', value: 'profile'},
            {key: 'profile.photos', value: 'photos'}
        ] as RelationsParsed);

        // nested data with alias
        allowed = parseRelations(['profile.photos', 'profile.photos.abc', 'profile.abc'], {allowed: ['profile.photos**'], defaultAlias: 'user'});
        expect(allowed).toEqual([
            {key: 'user.profile', value: 'profile'},
            {key: 'profile.photos', value: 'photos'},
            {key: 'photos.abc', value: 'abc'}
        ] as RelationsParsed);

        // null data
        allowed = parseRelations(null);
        expect(allowed).toEqual([]);
    });
});
