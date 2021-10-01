/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {buildQueryFields} from "./fields";
import {buildQueryIncludes} from "./includes";
import {buildQuerySort} from "./sort";
import {QueryRecord, QueryRecordKey} from "./type";
import {
    buildURLQueryString,
    flattenNestedProperties
} from "./utils";

export function buildQuery<T extends Record<string, any>>(record?: QueryRecord<T>): string {
    if (typeof record === 'undefined' || record === null) return '';

    let query: {
        [key in QueryRecordKey]?: any
    } = {};

    if (typeof record[QueryRecordKey.FILTER] !== 'undefined') {
        query[QueryRecordKey.FILTER] = flattenNestedProperties(record[QueryRecordKey.FILTER]);
    }

    if (typeof record[QueryRecordKey.FIELDS] !== 'undefined') {
        query[QueryRecordKey.FIELDS] = buildQueryFields(record[QueryRecordKey.FIELDS]);
    }

    if (typeof record[QueryRecordKey.PAGE] !== 'undefined') {
        query[QueryRecordKey.PAGE] = record[QueryRecordKey.PAGE];
    }

    if (typeof record[QueryRecordKey.SORT] !== 'undefined') {
        query[QueryRecordKey.SORT] = buildQuerySort(record[QueryRecordKey.SORT]);
    }

    if (typeof record[QueryRecordKey.INCLUDE] !== 'undefined') {
        query[QueryRecordKey.INCLUDE] = buildQueryIncludes(record[QueryRecordKey.INCLUDE]);
    }

    return buildURLQueryString(query);
}
