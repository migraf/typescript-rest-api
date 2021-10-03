/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {ParsedElementBase, ParseOptionsBase} from "../parse";
import {QueryKey} from "../type";
import {Flatten, KeyWithOptionalPrefix, OnlyObject, OnlyScalar} from "../utils";

export enum SortDirection {
    ASC = 'ASC',
    DESC = 'DESC'
}

// -----------------------------------------------------------
// Build
// -----------------------------------------------------------

type SortOperatorDesc = '-';
type SortWithOperator<T extends Record<string, any>> =
    KeyWithOptionalPrefix<keyof T, SortOperatorDesc> |
    KeyWithOptionalPrefix<keyof T, SortOperatorDesc>[];

export type SortQueryRecord<T> = {
    [K in keyof T]?: T[K] extends OnlyScalar<T[K]> ?
        SortDirection :
        T[K] extends OnlyObject<T[K]> ? SortQueryRecord<Flatten<T[K]>> | SortWithOperator<Flatten<T[K]>> : never
} | SortWithOperator<T>;


// -----------------------------------------------------------
// Parse
// -----------------------------------------------------------

export type SortParseOptions = ParseOptionsBase<QueryKey.SORT, string[] | string[][]>;
export type SortParsedElement = ParsedElementBase<QueryKey.SORT, SortDirection>;
export type SortParsed = SortParsedElement[];
