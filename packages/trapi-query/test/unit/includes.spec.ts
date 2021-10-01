/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {parseIncludes} from "../../src";

describe('src/includes/index.ts', () => {
    it('should transform request includes', () => {
        // single data matching
        let allowedIncludes = parseIncludes('profile', {allowed: ['profile']});
        expect(allowedIncludes).toEqual([
            {property: 'profile', alias: 'profile'}
        ]);

        allowedIncludes = parseIncludes([], {allowed: ['profile']});
        expect(allowedIncludes).toEqual([]);

        // with alias
        allowedIncludes = parseIncludes('pro', {aliasMapping: {pro: 'profile'}, allowed: ['profile']});
        expect(allowedIncludes).toEqual([
            {property: 'profile', alias: 'profile'}
        ]);

        // with nested alias
        allowedIncludes = parseIncludes(['abc.photos'], {
            allowed: ['profile.photos'],
            queryAlias: 'user',
            aliasMapping: {'abc.photos': 'profile.photos'}
        });
        expect(allowedIncludes).toEqual([
            {property: 'user.profile', alias: 'profile'},
            {property: 'profile.photos', alias: 'photos'}
        ]);

        // with nested alias & includeParents
        allowedIncludes = parseIncludes(['abc.photos'], {
            allowed: ['profile.photos'],
            queryAlias: 'user',
            aliasMapping: {'abc.photos': 'profile.photos'},
            includeParents: false
        });
        expect(allowedIncludes).toEqual([
            {property: 'profile.photos', alias: 'photos'}
        ]);

        // with nested alias & limited includeParents ( no user_roles rel)
        allowedIncludes = parseIncludes(['abc.photos', 'user_roles.role'], {
            allowed: ['profile.photos', 'user_roles.role'],
            queryAlias: 'user',
            aliasMapping: {'abc.photos': 'profile.photos'},
            includeParents: ['profile.**']
        });
        expect(allowedIncludes).toEqual([
            {property: 'user.profile', alias: 'profile'},
            {property: 'profile.photos', alias: 'photos'},
            {property: 'user_roles.role', alias: 'role'}
        ]);


        // multiple data matching
        allowedIncludes = parseIncludes(['profile', 'abc'], {allowed: ['profile']});
        expect(allowedIncludes).toEqual([{property: 'profile', alias: 'profile'}]);

        // no allowed
        allowedIncludes = parseIncludes(['profile'], {allowed: []});
        expect(allowedIncludes).toEqual([]);

        // all allowed
        allowedIncludes = parseIncludes(['profile'], {allowed: undefined});
        expect(allowedIncludes).toEqual([{property: 'profile', alias: 'profile'}]);

        // nested data with alias
        allowedIncludes = parseIncludes(['profile.photos', 'profile.photos.abc', 'profile.abc'], {allowed: ['profile.photos'], queryAlias: 'user'});
        expect(allowedIncludes).toEqual([
            {property: 'user.profile', alias: 'profile'},
            {property: 'profile.photos', alias: 'photos'}
        ]);

        // nested data with alias
        allowedIncludes = parseIncludes(['profile.photos', 'profile.photos.abc', 'profile.abc'], {allowed: ['profile.photos**'], queryAlias: 'user'});
        expect(allowedIncludes).toEqual([
            {property: 'user.profile', alias: 'profile'},
            {property: 'profile.photos', alias: 'photos'},
            {property: 'photos.abc', alias: 'abc'}
        ]);

        // null data
        allowedIncludes = parseIncludes(null);
        expect(allowedIncludes).toEqual([]);
    });
});
