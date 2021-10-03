/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {ParseOptionsBase} from "../parse";
import {QueryKey} from "../type";

// -----------------------------------------------------------
// Build
// -----------------------------------------------------------

export type PaginationQueryRecord<T> = {
    limit?: number,
    offset?: number
}

// -----------------------------------------------------------
// Parse
// -----------------------------------------------------------

export type PaginationParseOptions = ParseOptionsBase<QueryKey.PAGE> & {
    maxLimit?: number
};

export type PaginationParsed = ParseOptionsBase<QueryKey.PAGE> & {
    limit?: number,
    offset?: number
};
