/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {parseFields} from "./fields";
import {parseFilters} from "./filters";
import {parseIncludes} from "./includes";
import {parsePagination} from "./pagination";
import {parseSort} from "./sort";
import {QueryParseOptions, QueryParseOutput, QueryKey, QueryParseInput} from "./type";

export function parseQuery(
    input: QueryParseInput,
    options?: QueryParseOptions
) : QueryParseOutput {
    options ??= {};

    const output : QueryParseOutput = {};

    const nonEnabled : boolean = Object.keys(options).length === 0;

    for(let key in QueryKey) {
        const enabled = !!options[QueryKey[key]] ||
            nonEnabled;

        if(!enabled) continue;

        const keyOptions = typeof options[QueryKey[key]] === 'boolean' ||
            typeof options[QueryKey[key]] === 'undefined' ?
                {} :
                options[QueryKey[key]];

        switch (QueryKey[key]){
            case QueryKey.FIELDS:
                output[QueryKey[key]] = parseFields(input[QueryKey[key]], keyOptions);
                break;
            case QueryKey.FILTER:
                output[QueryKey[key]] = parseFilters(input[QueryKey[key]], keyOptions);
                break;
            case QueryKey.INCLUDE:
                output[QueryKey[key]] = parseIncludes(input[QueryKey[key]], keyOptions);
                break;
            case QueryKey.PAGE:
                output[QueryKey[key]] = parsePagination(input[QueryKey[key]], keyOptions);
                break;
            case QueryKey.SORT:
                output[QueryKey[key]] = parseSort(input[QueryKey[key]], keyOptions);
                break;
        }
    }

    return output;
}
