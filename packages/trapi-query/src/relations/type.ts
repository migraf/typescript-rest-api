/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {ParsedElementBase, ParseOptionsBase} from "../parse";
import {QueryKey} from "../type";
import {Flatten, OnlyObject} from "../utils";

// -----------------------------------------------------------
// Build
// -----------------------------------------------------------

export type RelationsQueryRecord<T extends Record<string, any>> = {
    [K in keyof T]?: T[K] extends OnlyObject<T[K]> ? RelationsQueryRecord<Flatten<T[K]>> | boolean : never
}

// -----------------------------------------------------------
// Parse
// -----------------------------------------------------------

export type RelationsParseOptions = ParseOptionsBase<QueryKey.INCLUDE> & {
    includeParents?: boolean | string[] | string
};

export type RelationParsedElement = ParsedElementBase<QueryKey.INCLUDE, string>;
export type RelationsParsed = RelationParsedElement[];



