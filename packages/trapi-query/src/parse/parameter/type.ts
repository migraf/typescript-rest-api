/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {FieldsParseOptions, FieldsParseOutput} from "../../parameter";
import {FiltersParseOptions, FiltersParseOutput} from "../../parameter";
import {PaginationParseOptions, PaginationParseOutput} from "../../parameter";
import {RelationsParseOptions, RelationsParseOutput} from "../../parameter";
import {SortParseOptions, SortParseOutput} from "../../parameter";

import {Parameter, ParameterType, URLParameter, URLParameterType} from "../../type";

export type ParseParameterOptions<T extends ParameterType | URLParameterType> = T extends Parameter.FIELDS | URLParameter.FIELDS ?
    FieldsParseOptions :
    T extends Parameter.FILTERS | URLParameter.FILTERS ?
        FiltersParseOptions :
        T extends Parameter.RELATIONS | URLParameter.RELATIONS ?
            RelationsParseOptions :
            T extends Parameter.PAGINATION | URLParameter.PAGINATION ?
                PaginationParseOptions :
                T extends Parameter.SORT | URLParameter.SORT ?
                    SortParseOptions :
                    {};

export type ParseParameterOutput<T extends ParameterType | URLParameterType> = T extends Parameter.FIELDS | URLParameter.FIELDS ?
    FieldsParseOutput :
    T extends Parameter.FILTERS | URLParameter.FILTERS ?
        FiltersParseOutput :
        T extends Parameter.RELATIONS | URLParameter.RELATIONS ?
            RelationsParseOutput :
            T extends Parameter.PAGINATION | URLParameter.PAGINATION ?
                PaginationParseOutput :
                T extends Parameter.SORT | URLParameter.SORT ?
                    SortParseOutput :
                    never;
