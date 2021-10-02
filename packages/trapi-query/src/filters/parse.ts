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
import {FilterOperator, FilterOperatorLabel, FiltersOptions, FiltersTransformed, FilterTransformed} from "./type";

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

    const temp : Record<string, {
        key: string,
        alias?: string,
        value: string | boolean | number
    }> = {};

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
        if(!isFieldAllowedByIncludes(fieldDetails, options.includes, {queryAlias: options.defaultAlias})) {
            continue;
        }

        const keyWithQueryAlias : string = buildFieldWithQueryAlias(fieldDetails, options.defaultAlias);

        if(
            typeof options.allowed !== 'undefined' &&
            options.allowed.indexOf(key) === -1 &&
            options.allowed.indexOf(keyWithQueryAlias) === -1
        ) {
            continue;
        }

        const alias : string | undefined =  typeof fieldDetails.path === 'undefined' &&
            typeof fieldDetails.alias === 'undefined' ?
                (
                    options.defaultAlias ?
                    options.defaultAlias :
                    undefined
                )
                :
                fieldDetails.alias
            ;

        temp[keyWithQueryAlias] = {
            key: fieldDetails.name,
            ...(alias ? {alias} : {}),
            value: value as string | boolean | number
        };
    }

    const items : FiltersTransformed = [];

    /* istanbul ignore next */
    for (const key in temp) {
        /* istanbul ignore next */
        if (!temp.hasOwnProperty(key)) {
            continue;
        }

        const filter : FilterTransformed = {
            ...(temp[key].alias ? {alias:  temp[key].alias} : {}),
            key: temp[key].key,
            value:  temp[key].value
        }

        if(typeof filter.value === 'string') {
            const negationOperator : boolean = filter.value.charAt(0) === FilterOperator.NEGATION;
            if(negationOperator) {
                filter.operator ??= {};
                filter.operator[FilterOperatorLabel.NEGATION] = negationOperator;
                filter.value = filter.value.slice(1);
            }

            const likeOperator : boolean = filter.value.charAt(0) === FilterOperator.LIKE;
            if (likeOperator) {
                filter.operator ??= {};
                filter.operator[FilterOperatorLabel.LIKE] = likeOperator;
                filter.value = filter.value.slice(1);
            }

            const inOperator : boolean = filter.value.includes(FilterOperator.IN);
            if(inOperator) {
                filter.operator ??= {};
                filter.operator[FilterOperatorLabel.IN] = true;
            }

            if(typeof filter.operator !== 'undefined') {
                filter.value = filter.operator[FilterOperatorLabel.IN] ? filter.value.split(',') : filter.value;
            }
        }

        items.push(filter);
    }

    return items;
}
