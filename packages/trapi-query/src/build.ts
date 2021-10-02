/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {buildQueryFields} from "./fields";
import {buildQueryFilters} from "./filters";
import {buildQueryIncludes} from "./includes";
import {buildQuerySort} from "./sort";
import {QueryRecord, QueryKey} from "./type";
import {
    buildURLQueryString
} from "./utils";

export function buildQuery<T extends Record<string, any>>(
    record?: QueryRecord<T>
) : string {
    if (typeof record === 'undefined' || record === null) return '';

    let query: {
        [key in QueryKey]?: any
    } = {};

    if (typeof record[QueryKey.FIELDS] !== 'undefined') {
        query[QueryKey.FIELDS] = buildQueryFields(record[QueryKey.FIELDS]);
    }

    if (typeof record[QueryKey.FILTER] !== 'undefined') {
        query[QueryKey.FILTER] = buildQueryFilters(record[QueryKey.FILTER]);
    }

    if (typeof record[QueryKey.INCLUDE] !== 'undefined') {
        query[QueryKey.INCLUDE] = buildQueryIncludes(record[QueryKey.INCLUDE]);
    }

    if (typeof record[QueryKey.PAGE] !== 'undefined') {
        query[QueryKey.PAGE] = record[QueryKey.PAGE];
    }

    if (typeof record[QueryKey.SORT] !== 'undefined') {
        query[QueryKey.SORT] = buildQuerySort(record[QueryKey.SORT]);
    }

    return buildURLQueryString(query);
}
