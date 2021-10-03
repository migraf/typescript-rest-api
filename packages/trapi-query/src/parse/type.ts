/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {FieldsParsed, FieldsParseOptions} from "../fields";
import {FiltersParsed, FiltersParseOptions} from "../filters";
import {PaginationParsed, PaginationParseOptions} from "../pagination";
import {RelationsParsed, RelationsParseOptions} from "../relations";
import {SortParsed, SortParseOptions} from "../sort";
import {QueryKey} from "../type";

export type ParseOptionsBase<
    K extends QueryKey,
    A = string[]
> = K extends QueryKey.PAGE ? {} : {
    aliasMapping?: Record<string, string>,
    allowed?: A,
    defaultAlias?: string
} & ParseOptionInclude<K>;

type ParseOptionInclude<K extends QueryKey> = K extends QueryKey.INCLUDE | QueryKey.PAGE ? {} : {
   relations?: RelationsParsed
} ;

//------------------------------------------------

export type ParsedElementBase<
    K extends QueryKey,
    V extends unknown | undefined = undefined
> = K extends QueryKey.PAGE ? {} : {
    key: string
} & ParsedElementAlias<K> & ParsedElementValue<K, V>

type ParsedElementAlias<K extends QueryKey> = K extends QueryKey.INCLUDE ? {} : {
    alias?: string
}

type ParsedElementValue<
    K extends QueryKey,
    V = undefined
> = K extends QueryKey.FIELDS ? {
    value?: V
} : {
    value: V
}
export type QueryParseInput = {
    [K in QueryKey]?: any
}
export type QueryParseOptions = {
    /**
     * On default all query keys are enabled.
     */
    [K in QueryKey]?: QueryKeyParseOptions<K> | boolean
}
export type QueryParseOutput = {
    [K in QueryKey]?: QueryRecordParsed<K>
}
export type QueryKeyParseOptions<T extends QueryKey> = T extends QueryKey.FIELDS ?
    FieldsParseOptions :
    T extends QueryKey.FILTER ?
        FiltersParseOptions :
        T extends QueryKey.INCLUDE ?
            RelationsParseOptions :
            T extends QueryKey.PAGE ?
                PaginationParseOptions :
                T extends QueryKey.SORT ?
                    SortParseOptions :
                    never;

export type QueryRecordParsed<T extends QueryKey> = T extends QueryKey.FIELDS ?
    FieldsParsed :
    T extends QueryKey.FILTER ?
        FiltersParsed :
        T extends QueryKey.INCLUDE ?
            RelationsParsed :
            T extends QueryKey.PAGE ?
                PaginationParsed :
                T extends QueryKey.SORT ?
                    SortParsed :
                    never;
