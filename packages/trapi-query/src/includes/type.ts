/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {Flatten, OnlyObject} from "../utils";

export type IncludeTransformed = {
    property: string,
    alias: string
};
export type IncludesTransformed = IncludeTransformed[];
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
