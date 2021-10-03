/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {parseFields} from "../fields";
import {parseFilters} from "../filters";
import {RelationsParsed, parseRelations} from "../relations";
import {parsePagination} from "../pagination";
import {parseSort} from "../sort";
import {QueryKey} from "../type";
import {QueryKeyParseOptions, QueryParseInput, QueryParseOptions, QueryParseOutput} from "./type";

export function parseQuery(
    input: QueryParseInput,
    options?: QueryParseOptions
) : QueryParseOutput {
    options ??= {};

    const output : QueryParseOutput = {};

    const nonEnabled : boolean = Object.keys(options).length === 0;

    let includes : RelationsParsed | undefined;
    if(!!options[QueryKey.INCLUDE] || nonEnabled) {
        includes = parseRelations(input[QueryKey.INCLUDE], getOptionsForQueryKey(options, QueryKey.INCLUDE));
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
    includeParsed?: K extends Extract<QueryKey,QueryKey.INCLUDE> ? never : RelationsParsed
) : QueryKeyParseOptions<K> {
    return typeof options[key] === 'boolean' ||
    typeof options[key] === 'undefined' ?
        {} as QueryKeyParseOptions<K> :
        {
            ...(options[key] as QueryKeyParseOptions<K>),
            ...(key === QueryKey.INCLUDE ? {} : {includes: includeParsed})
        };
}
