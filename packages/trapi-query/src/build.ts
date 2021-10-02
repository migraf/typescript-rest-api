/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {buildQueryFields} from "./fields";
import {buildQueryIncludes} from "./includes";
import {buildQuerySort} from "./sort";
import {QueryBuildOptions, QueryRecord, QueryKey} from "./type";
import {
    buildURLQueryString,
    flattenNestedProperties
} from "./utils";

export function buildQuery<T extends Record<string, any>>(
    record?: QueryRecord<T>,
    options?: QueryBuildOptions
) : string {
    if (typeof record === 'undefined' || record === null) return '';

    options ??= {};
    options.alias ??= {};

    let query: {
        [key in QueryKey]?: any
    } = {};

    if (typeof record[QueryKey.FIELDS] !== 'undefined') {
        query[options.alias[QueryKey.FIELDS] ?? QueryKey.FIELDS] = buildQueryFields(record[QueryKey.FIELDS]);
    }

    if (typeof record[QueryKey.FILTER] !== 'undefined') {
        query[options.alias[QueryKey.FILTER] ?? QueryKey.FILTER] = flattenNestedProperties(record[QueryKey.FILTER]);
    }

    if (typeof record[QueryKey.INCLUDE] !== 'undefined') {
        query[options.alias[QueryKey.INCLUDE] ?? QueryKey.INCLUDE] = buildQueryIncludes(record[QueryKey.INCLUDE]);
    }

    if (typeof record[QueryKey.PAGE] !== 'undefined') {
        query[options.alias[QueryKey.PAGE] ?? QueryKey.PAGE] = record[QueryKey.PAGE];
    }

    if (typeof record[QueryKey.SORT] !== 'undefined') {
        query[options.alias[QueryKey.SORT] ?? QueryKey.SORT] = buildQuerySort(record[QueryKey.SORT]);
    }

    return buildURLQueryString(query);
}
