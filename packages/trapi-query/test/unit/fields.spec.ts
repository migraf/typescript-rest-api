/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    buildDomainFields,
    DEFAULT_ALIAS_ID,
    FieldOperator,
    FieldsOptions,
    FieldsTransformed,
    parseFields,
    parseIncludes
} from "../../src";
import {buildObjectFromStringArray} from "../../src/utils";

describe('src/fields/index.ts', () => {
    it('should transform allowed domain fields', () => {
        const fields : string[] = ['id','name'];

        let transformedFields = buildDomainFields(fields);
        expect(transformedFields).toEqual({[DEFAULT_ALIAS_ID]: fields});

        transformedFields = buildDomainFields({domain: fields});
        expect(transformedFields).toEqual({domain: fields});

        transformedFields = buildDomainFields({});
        expect(transformedFields).toEqual({});
    });

    it('should transform fields', () => {
        const options : FieldsOptions = {
            allowed: ['id', 'name']
        };

        // fields undefined
        let data = parseFields(undefined, options);
        expect(data).toEqual([]);

        // fields as array
        data = parseFields(['id'], options);
        expect(data).toEqual([{key: 'id'}] as FieldsTransformed);

        // fields as string
        data = parseFields('id', options);
        expect(data).toEqual([{key: 'id'}] as FieldsTransformed);

        // multiple fields but only one valid field
        data = parseFields(['id', 'avatar'], options);
        expect(data).toEqual([{key: 'id'}] as FieldsTransformed);

        // field as string and append fields
        data = parseFields('+id', options);
        expect(data).toEqual([{key: 'id', operator: FieldOperator.INCLUDE}] as FieldsTransformed);

        data = parseFields('-id', options);
        expect(data).toEqual([{key: 'id', operator: FieldOperator.EXCLUDE}] as FieldsTransformed);

        // fields as string and append fields
        data = parseFields('id,+name', options);
        expect(data).toEqual([{key: 'id'}, {key: 'name', operator: FieldOperator.INCLUDE}] as FieldsTransformed);

        // empty allowed -> allows nothing
        data = parseFields('id', {...options, allowed: []});
        expect(data).toEqual([] as FieldsTransformed);

        // undefined allowed -> allows everything
        data = parseFields('id', {...options, allowed: undefined});
        expect(data).toEqual([{key: 'id'}] as FieldsTransformed);

        // field not allowed
        data = parseFields('avatar', options);
        expect(data).toEqual([] as FieldsTransformed);

        // field with invalid value
        data = parseFields({id: null}, options);
        expect(data).toEqual([] as FieldsTransformed);

        // if only one domain is given, try to parse request field to single domain.
        data = parseFields( ['id'], {allowed: {domain: ['id']}});
        expect(data).toEqual({domain: [{key: 'id'}]} as FieldsTransformed);

        // if multiple possibilities are available for request field, than parse to none
        data = parseFields( ['id'], {allowed: {domain: ['id'], domain2: ['id']}});
        expect(data).toEqual([] as FieldsTransformed);
    });

    it('should transform fields with includes', () => {
        const includes = parseIncludes(['profile', 'roles'], {allowed: ['user', 'profile']});

        // simple domain match
        let data = parseFields( {profile: ['id']}, {allowed: {profile: ['id']}, includes: includes});
        expect(data).toEqual({profile: [{key: 'id'}]} as FieldsTransformed);

        // only single domain match
        data = parseFields( {profile: ['id'], permissions: ['id']}, {allowed: {profile: ['id'], permissions: ['id']}, includes: includes});
        expect(data).toEqual({profile: [{key: 'id'}]} as FieldsTransformed);
    });

    it('should transform allowed fields', () => {
        const fields : string[] = ['id'];

        let transformedFields = buildObjectFromStringArray(fields);
        expect(transformedFields).toEqual({[fields[0]]: fields[0]});

        transformedFields = buildObjectFromStringArray({idAlias: 'id'});
        expect(transformedFields).toEqual({idAlias: 'id'});
    });
});
