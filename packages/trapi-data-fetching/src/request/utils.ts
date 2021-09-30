/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {hasOwnProperty} from "../utils";
import {buildQuery} from "./query";
import {FieldRecord, RequestRecord, RequestRecordKey, SortRecord} from "./type";

export function formatRequestRecord<T extends Record<string, any>>(record?: RequestRecord<T>) : string {
    if(typeof record === 'undefined' || record === null) return '';

    let query : {
        [key in RequestRecordKey]?: any
    } = {};

    if(typeof record[RequestRecordKey.FILTER] !== 'undefined') {
        query[RequestRecordKey.FILTER] = flattenNestedProperties(record[RequestRecordKey.FILTER]);
    }

    if(typeof record[RequestRecordKey.FIELDS] !== 'undefined') {
        query[RequestRecordKey.FIELDS] = formatRequestFields(record[RequestRecordKey.FIELDS]);
    }

    if(typeof record[RequestRecordKey.PAGE] !== 'undefined') {
        query[RequestRecordKey.PAGE] = record[RequestRecordKey.PAGE];
    }

    if(typeof record[RequestRecordKey.SORT] !== 'undefined') {
        query[RequestRecordKey.SORT] = formatRequestSort(record[RequestRecordKey.SORT]);
    }

    return buildQuery(query);
}

export function flattenNestedProperties<T>(data: Record<string, any>, prefixParts : string[] = []) : Record<string, any> {
    let query : Record<string, any> = {};

    for(let key in data) {
        switch (true) {
            case typeof data[key] === 'boolean' ||
                typeof data[key] === 'string' ||
                typeof data[key] === 'number' ||
                typeof data[key] === 'undefined' ||
                query[key] === null ||
                Array.isArray(data[key]):
                    const destinationKey = [...prefixParts, key].join('.');
                    query[destinationKey] = data[key];
                break;
            default:
                // todo: this might be risky, if an entity has 'operator' and 'value' properties :( ^^
                if(
                    hasOwnProperty(data[key], 'operator') &&
                    hasOwnProperty(data[key], 'value')
                ) {
                    const value = Array.isArray(data[key].value) ? data[key].value.join(',') : data[key].value;
                    const destinationKey = [...prefixParts, key].join('.');
                    query[destinationKey] = `${data[key].operator}${value}`;
                    continue;
                }

                query = {...query, ...flattenNestedProperties(data[key], [...prefixParts, key])}
                break;
        }
    }

    return query;
}

export function formatRequestFields<T>(data: FieldRecord<T>) : Record<string, any> | string | string[]  {
    switch (true) {
        case typeof data === 'string':
            return data;
        case Array.isArray(data):
            return data;
        default:
            return flattenNestedProperties(data as Record<string, any>);
    }
}

export function formatRequestSort<T>(data: SortRecord<T>) {
    switch (true) {
        case typeof data === 'string':
            return data;
        case Array.isArray(data):
            return data;
        default:
            return flattenNestedProperties(data as Record<string, any>);
    }
}
