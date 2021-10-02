/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {parseFields} from "./fields";
import {parseFilters} from "./filters";
import {IncludesParsed, parseIncludes} from "./includes";
import {parsePagination} from "./pagination";
import {parseSort} from "./sort";
import {QueryKey, QueryKeyOption, QueryParseInput, QueryParseOptions, QueryParseOutput} from "./type";

export function parseQuery(
    input: QueryParseInput,
    options?: QueryParseOptions
) : QueryParseOutput {
    options ??= {};

    const output : QueryParseOutput = {};

    const nonEnabled : boolean = Object.keys(options).length === 0;

    let includes : IncludesParsed | undefined;
    if(!!options[QueryKey.INCLUDE] || nonEnabled) {
        includes = parseIncludes(input[QueryKey.INCLUDE], getOptionsForQueryKey(options, QueryKey.INCLUDE));
        output[QueryKey.INCLUDE] = includes;
    }

    const keys : QueryKey[] = [
        QueryKey.FIELDS,
        QueryKey.FILTER,
        QueryKey.PAGE,
        QueryKey.SORT
    ];

    for(let i=0; i< keys.length; i++) {
        const enabled = !!options[keys[i]] ||
            nonEnabled;

        if(!enabled) continue;

        const key : QueryKey = keys[i];

        switch (key){
            case QueryKey.FIELDS:
                output[key] = parseFields(input[key], getOptionsForQueryKey(options, key, includes));
                break;
            case QueryKey.FILTER:
                output[key] = parseFilters(input[key], getOptionsForQueryKey(options, key, includes));
                break;
            case QueryKey.PAGE:
                output[key] = parsePagination(input[key], getOptionsForQueryKey(options, key, includes));
                break;
            case QueryKey.SORT:
                output[key] = parseSort(input[key], getOptionsForQueryKey(options, key, includes));
                break;
        }
    }

    return output;
}

function getOptionsForQueryKey<K extends QueryKey>(
    options: QueryParseOptions,
    key: K,
    includeParsed?: K extends Extract<QueryKey,QueryKey.INCLUDE> ? never : IncludesParsed
) : QueryKeyOption<K> {
    return typeof options[key] === 'boolean' ||
    typeof options[key] === 'undefined' ?
        {} as QueryKeyOption<K> :
        {
            ...(options[key] as QueryKeyOption<K>),
            ...(key === QueryKey.INCLUDE ? {} : {includes: includeParsed})
        };
}
