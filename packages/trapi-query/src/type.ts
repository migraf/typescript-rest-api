/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {FieldRecord, FieldsOptions, FieldsParsed} from "./fields";
import {FilterRecord, FiltersOptions, FiltersParsed} from "./filters";
import {IncludeRecord, IncludesOptions, IncludesParsed} from "./includes";
import {PaginationOptions, PaginationRecord, PaginationParsed} from "./pagination";
import {SortOptions, SortRecord, SortParsed} from "./sort";

// -----------------------------------------------------------

export enum QueryKey {
    FILTER = 'filter',
    FIELDS = 'fields',
    SORT = 'sort',
    INCLUDE = 'include',
    PAGE = 'page'
}
// -----------------------------------------------------------

export type QueryRecord<R extends Record<string, any>> = {
    [K in QueryKey]?: QueryRecordType<K,R>
}

export type QueryRecordType<
    T extends QueryKey,
    R extends Record<string, any>
> = T extends QueryKey.FIELDS ?
    FieldRecord<R> :
    T extends QueryKey.FILTER ?
        FilterRecord<R> :
        T extends QueryKey.INCLUDE ?
            IncludeRecord<R> :
            T extends QueryKey.PAGE ?
                PaginationRecord<R> :
                T extends QueryKey.SORT ?
                    SortRecord<R> :
                    never;

// -----------------------------------------------------------

export type QueryParseInput = {
    [K in QueryKey]?: any
}

export type QueryParseOptions = {
    /**
     * On default all query keys are enabled.
     */
    [K in QueryKey]?: QueryKeyOption<K> | boolean
}

export type QueryParseOutput = {
    [K in QueryKey]?: QueryRecordTransformed<K>
}

export type QueryKeyOption<T extends QueryKey> = T extends QueryKey.FIELDS ?
        FieldsOptions :
    T extends QueryKey.FILTER ?
            FiltersOptions :
        T extends  QueryKey.INCLUDE ?
                IncludesOptions :
            T extends QueryKey.PAGE ?
                    PaginationOptions :
                T extends QueryKey.SORT ?
                        SortOptions :
                        never;


export type QueryRecordTransformed<T extends QueryKey> = T extends QueryKey.FIELDS ?
        FieldsParsed :
    T extends QueryKey.FILTER ?
            FiltersParsed :
        T extends QueryKey.INCLUDE ?
                IncludesParsed :
            T extends QueryKey.PAGE ?
                    PaginationParsed :
                T extends QueryKey.SORT ?
                        SortParsed :
                        never;
