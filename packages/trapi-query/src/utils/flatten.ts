/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {hasOwnProperty} from "./index";

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

