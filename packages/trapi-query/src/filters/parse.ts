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
import {FiltersOptions, FiltersTransformed} from "./type";

// --------------------------------------------------

// --------------------------------------------------

function buildOptions(options?: FiltersOptions) : FiltersOptions {
    options ??= {};

    if(options.aliasMapping) {
        options.aliasMapping = buildObjectFromStringArray(options.aliasMapping);
    } else {
        options.aliasMapping = {};
    }

    options.includes ??= [];

    return options;
}

export function parseFilters(
    data: unknown,
    options?: FiltersOptions
) : FiltersTransformed {
    options = options ?? {};

    // If it is an empty array nothing is allowed

    if(
        typeof options.allowed !== 'undefined' &&
        Object.keys(options.allowed).length === 0
    ) {
        return [];
    }

    const prototype: string = Object.prototype.toString.call(data);
    /* istanbul ignore next */
    if (prototype !== '[object Object]') {
        return [];
    }

    const length : number = Object.keys(data as Record<string, any>).length;
    if(length === 0) {
        return [];
    }

    options = buildOptions(options);

    const temp : Record<string, string | boolean | number> = {};

    // transform to appreciate data format & validate input
    for (let key in (data as Record<string, any>)) {
        /* istanbul ignore next */
        if (!data.hasOwnProperty(key)) {
            continue;
        }

        let value : unknown = (data as Record<string, any>)[key];

        if (
            typeof value !== 'string' &&
            typeof value !== 'number' &&
            typeof value !== 'boolean'
        ) {
            continue;
        }

        if(typeof value === 'string') {
            value = (value as string).trim();
            const stripped : string = (value as string).replace('/,/g', '');

            if (stripped.length === 0) {
                continue;
            }
        }


        if(options.aliasMapping.hasOwnProperty(key)) {
            key = options.aliasMapping[key];
        }

        const fieldDetails : FieldDetails = getFieldDetails(key);
        if(!isFieldAllowedByIncludes(fieldDetails, options.includes, {queryAlias: options.queryAlias})) {
            continue;
        }

        const keyWithQueryAlias : string = buildFieldWithQueryAlias(fieldDetails, options.queryAlias);

        if(
            typeof options.allowed !== 'undefined' &&
            options.allowed.indexOf(key) === -1 &&
            options.allowed.indexOf(keyWithQueryAlias) === -1
        ) {
            continue;
        }

        temp[keyWithQueryAlias] = value as string | boolean | number;
    }

    const items : FiltersTransformed = [];

    /* istanbul ignore next */
    for (const key in temp) {
        /* istanbul ignore next */
        if (!temp.hasOwnProperty(key)) {
            continue;
        }

        let value : string | boolean | number = temp[key];

        /* istanbul ignore next */
        const paramKey : string =
            typeof options.queryBindingKeyFn === 'function' ?
                options.queryBindingKeyFn(key) :
                'filter_' + key.replace(/\W/g, '_');

        const queryString : string[] = [
            key
        ];

        let isInOperator : boolean = false;

        if(typeof value === 'string') {
            const isNegationPrefix = value.charAt(0) === '!';
            if (isNegationPrefix) value = value.slice(1);

            const isLikeOperator = value.charAt(0) === '~';
            if (isLikeOperator) value = value.slice(1);

            isInOperator = value.includes(',');

            if(isInOperator || isLikeOperator) {
                if (isNegationPrefix) {
                    queryString.push('NOT');
                }

                if (isLikeOperator) {
                    queryString.push('LIKE');
                } else {
                    queryString.push('IN');
                }
            } else {
                if (isNegationPrefix) {
                    queryString.push("!=");
                } else {
                    queryString.push("=");
                }
            }

            if (isLikeOperator) {
                value += '%';
            }

            if (isInOperator) {
                queryString.push('(:...' + paramKey + ')');
            } else {
                queryString.push(':' + paramKey);
            }
        } else {
            isInOperator = false;
            queryString.push("=");
            queryString.push(':' + paramKey);
        }

        items.push({
            statement: queryString.join(" "),
            binding: {[paramKey]: isInOperator ? (value as string).split(',') : value}
        });
    }

    return items;
}
