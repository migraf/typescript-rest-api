/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {IncludesTransformed} from "../includes";
import {Flatten, KeyWithOptionalPrefix, OnlyObject, ToOneAndMany} from "../utils";

export const DEFAULT_ALIAS_ID: string = '__DEFAULT__';

export type FieldsOptions = {
    aliasMapping?: Record<string, string>,
    allowed?: Record<string, string[]> | string[],
    includes?: IncludesTransformed,
    queryAlias?: string
};

/*
export type AliasFields = {
    addFields?: boolean,
    alias?: string,
    fields: string[]
};

export type FieldsTransformed = AliasFields[];
 */

export type FieldTransformed = {
    key: string,
    operator?: FieldOperator
};

export type FieldsTransformed = Record<string, FieldTransformed[]> | FieldTransformed[];

// -----------------------------------------------------------

export enum FieldOperator {
    INCLUDE = '+',
    EXCLUDE = '-'
}

type FieldWithOperator<T extends Record<string, any>> =
    KeyWithOptionalPrefix<keyof T, FieldOperator> |
    KeyWithOptionalPrefix<keyof T, FieldOperator>[];

export type FieldRecord<T> =
    {
        [K in keyof T]?: T[K] extends OnlyObject<T[K]> ?
        (FieldRecord<Flatten<T[K]>> | FieldWithOperator<Flatten<T[K]>>) : never
    } |
    {
        [key: string]: ToOneAndMany<KeyWithOptionalPrefix<keyof T, FieldOperator>[]>,
    } |
    FieldWithOperator<T>;
