/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    buildObjectFromStringArray,
    buildFieldWithQueryAlias,
    FieldDetails,
    getFieldDetails,
    isFieldAllowedByIncludes
} from "../utils";
import {SortDirection, SortOptions, SortTransformed} from "./type";

// --------------------------------------------------

// --------------------------------------------------

function isMultiDimensionalArray(arr: unknown) : arr is unknown[][] {
    if(!Array.isArray(arr)) {
        return false;
    }

    return arr.length > 0 && Array.isArray(arr[0]);
}

/**
 * Transform sort data to appreciate data format.
 * @param data
 * @param options
 */
export function parseSort(
    data: unknown,
    options?: SortOptions
) : SortTransformed {
    options = options ?? {};

    // If it is an empty array nothing is allowed
    if(
        Array.isArray(options.allowed) &&
        options.allowed.length === 0
    ) {
        return {};
    }

    options.aliasMapping = options.aliasMapping ? buildObjectFromStringArray(options.aliasMapping) : {};

    const items : SortTransformed = {};

    const prototype = Object.prototype.toString.call(data);

    /* istanbul ignore next */
    if(
        prototype !== '[object String]' &&
        prototype !== '[object Array]' &&
        prototype !== '[object Object]'
    ) {
        return items;
    }

    let parts : string[] = [];

    if(prototype === '[object String]') {
        parts = (data as string).split(',');
    }

    if(prototype === '[object Array]') {
        parts = (data as string[]).filter(item => typeof item === 'string');
    }

    if(prototype === '[object Object]') {
        const ob : Record<string, any> = data as object;
        for(const key in ob) {
            /* istanbul ignore next */
            if (
                !ob.hasOwnProperty(key) ||
                typeof key !== 'string' ||
                typeof ob[key] !== 'string'

            ) continue;

            const fieldPrefix = ob[key].toLowerCase() === 'desc' ? '-' : '';

            parts.push(fieldPrefix + key);
        }
    }

    for(let i=0; i<parts.length; i++) {
        let direction: SortDirection = 'ASC';
        if (parts[i].substr(0, 1) === '-') {
            direction = 'DESC';
            parts[i] = parts[i].substr(1);
        }

        let key: string = parts[i];

        if (options.aliasMapping.hasOwnProperty(key)) {
            key = options.aliasMapping[key];
        }

        const fieldDetails : FieldDetails = getFieldDetails(key);
        if(!isFieldAllowedByIncludes(fieldDetails, options.includes, {queryAlias: options.queryAlias})) {
            continue;
        }

        const keyWithQueryAlias : string = buildFieldWithQueryAlias(fieldDetails, options.queryAlias);

        if(
            typeof options.allowed !== 'undefined' &&
            !isMultiDimensionalArray(options.allowed) &&
            options.allowed.indexOf(key) === -1 &&
            options.allowed.indexOf(keyWithQueryAlias) === -1
        ) {
            continue;
        }

        items[keyWithQueryAlias] = direction;
    }

    if(isMultiDimensionalArray(options.allowed)) {
        outerLoop:
        for(let i=0; i<options.allowed.length; i++) {
            const temp : SortTransformed = {};

            for(let j=0; j<options.allowed[i].length; j++) {
                const keyWithAlias : string = options.allowed[i][j];
                const key : string = keyWithAlias.includes('.') ? keyWithAlias.split('.').pop() : keyWithAlias;

                if(items.hasOwnProperty(key) || items.hasOwnProperty(keyWithAlias)) {
                    temp[keyWithAlias] = items.hasOwnProperty(key) ? items[key] : items[keyWithAlias];
                } else {
                    continue outerLoop;
                }
            }

            return temp;
        }

        // if we get no match, the sort data is invalid.
        return {};
    }

    return items;
}



