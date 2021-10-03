/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {ParsedElementBase, ParseOptionsBase} from "../parse";
import {QueryKey} from "../type";
import {Flatten, KeyWithOptionalPrefix, OnlyObject, ToOneAndMany} from "../utils";

export const DEFAULT_ALIAS_ID: string = '__DEFAULT__';

// -----------------------------------------------------------
// Build
// -----------------------------------------------------------

export enum FieldOperator {
    INCLUDE = '+',
    EXCLUDE = '-'
}

type FieldWithOperator<T extends Record<string, any>> =
    KeyWithOptionalPrefix<keyof T, FieldOperator> |
    KeyWithOptionalPrefix<keyof T, FieldOperator>[];

export type FieldsQueryRecord<T> =
    {
        [K in keyof T]?: T[K] extends OnlyObject<T[K]> ?
        (FieldsQueryRecord<Flatten<T[K]>> | FieldWithOperator<Flatten<T[K]>>) : never
    } |
    {
        [key: string]: ToOneAndMany<KeyWithOptionalPrefix<keyof T, FieldOperator>[]>,
    } |
    FieldWithOperator<T>;

// -----------------------------------------------------------
// Parse
// -----------------------------------------------------------

export type FieldsParseOptions = ParseOptionsBase<QueryKey.FIELDS, Record<string, string[]> | string[]>;

export type FieldsParsedElement = ParsedElementBase<QueryKey.FIELDS, FieldOperator>;
export type FieldsParsed = FieldsParsedElement[];
