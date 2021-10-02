/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {IncludesParsed} from "../includes";
import {Flatten, KeyWithOptionalPrefix, OnlyObject, OnlyScalar} from "../utils";

export type SortOptions = {
    aliasMapping?: Record<string, string>,
    allowed?: string[] | string[][],
    includes?: IncludesParsed,
    defaultAlias?: string,
};
export enum SortDirection {
    ASC = 'ASC',
    DESC = 'DESC'
}

export type SortElementParsed = {
    alias?: string,
    key: string,
    value: SortDirection
}
export type SortParsed = SortElementParsed[];

// -----------------------------------------------------------

type SortOperatorDesc = '-';
type SortWithOperator<T extends Record<string, any>> =
    KeyWithOptionalPrefix<keyof T, SortOperatorDesc> |
    KeyWithOptionalPrefix<keyof T, SortOperatorDesc>[];

export type SortRecord<T> = {
    [K in keyof T]?: T[K] extends OnlyScalar<T[K]> ?
        SortDirection :
        T[K] extends OnlyObject<T[K]> ? SortRecord<Flatten<T[K]>> | SortWithOperator<Flatten<T[K]>> : never
} | SortWithOperator<T>;
