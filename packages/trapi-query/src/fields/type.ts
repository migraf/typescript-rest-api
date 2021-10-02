/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {IncludesParsed} from "../includes";
import {Flatten, KeyWithOptionalPrefix, OnlyObject, ToOneAndMany} from "../utils";

export const DEFAULT_ALIAS_ID: string = '__DEFAULT__';

export type FieldsOptions = {
    aliasMapping?: Record<string, string>,
    allowed?: Record<string, string[]> | string[],
    includes?: IncludesParsed,
    queryAlias?: string
};

export type FieldParsed = {
    key: string,
    alias?: string,
    operator?: FieldOperator
};

export type FieldsParsed = FieldParsed[];

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
