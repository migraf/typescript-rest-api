/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {Flatten, OnlyObject} from "../utils";

export type IncludeParsed = {
    property: string,
    alias: string
};
export type IncludesParsed = IncludeParsed[];
export type IncludesOptions = {
    aliasMapping?: Record<string, string>,
    allowed?: string[],
    includeParents?: boolean | string[] | string,
    queryAlias?: string
};

// -----------------------------------------------------------

export type IncludeRecord<T extends Record<string, any>> = {
    [K in keyof T]?: T[K] extends OnlyObject<T[K]> ? IncludeRecord<Flatten<T[K]>> | boolean : never
}
