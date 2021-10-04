/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {parseQueryFields, parseQueryFilters} from "../../parameter";
import {parseQueryPagination} from "../../parameter";
import {parseQueryRelations, RelationsParseOutput} from "../../parameter";
import {parseQuerySort} from "../../parameter";
import {Parameter, ParameterType, URLParameter, URLParameterType} from "../../type";
import {ParseParameterOptions, ParseParameterOutput} from "./type";

export function parseQueryParameter<K extends ParameterType | URLParameterType>(
    key: K,
    data: unknown,
    options?: ParseParameterOptions<K> | boolean,
    relations?: RelationsParseOutput
): ParseParameterOutput<K> {
    switch (key) {
        case Parameter.FIELDS:
        case URLParameter.FIELDS:
            return (parseQueryFields(
                data,
                {
                    ...(invalidToEmptyObject(options)) as ParseParameterOptions<Parameter.FIELDS>,
                    ...(relations ? {relations} : {})
                }
            ) as ParseParameterOutput<K>);
        case Parameter.FILTERS:
        case URLParameter.FILTERS:
            return (parseQueryFilters(
                data,
                {
                    ...(invalidToEmptyObject(options)) as ParseParameterOptions<Parameter.FILTERS>,
                    ...(relations ? {relations} : {})
                }
            ) as ParseParameterOutput<K>);
        case Parameter.PAGINATION:
        case URLParameter.PAGINATION:
            return (parseQueryPagination(
                data,
                {
                    ...(invalidToEmptyObject(options)) as ParseParameterOptions<Parameter.PAGINATION>,
                    ...(relations ? {relations} : {})
                }
            ) as ParseParameterOutput<K>);
        case Parameter.RELATIONS:
        case URLParameter.RELATIONS:
            return (parseQueryRelations(
                data,
                {
                    ...(invalidToEmptyObject(options)) as ParseParameterOptions<Parameter.RELATIONS>
                }
            ) as ParseParameterOutput<K>);
        case Parameter.SORT:
        case URLParameter.SORT:
            return (parseQuerySort(
                data,
                {
                    ...(invalidToEmptyObject(options)) as ParseParameterOptions<Parameter.SORT>,
                    ...(relations ? {relations} : {})
                }
            ) as ParseParameterOutput<K>);
    }
}

function invalidToEmptyObject<K extends Parameter>(
    value: ParseParameterOptions<K> | boolean
): ParseParameterOptions<K> {
    return typeof value === 'boolean' ||
    typeof value === 'undefined' ?
        {} as ParseParameterOptions<K> :
        value;
}
