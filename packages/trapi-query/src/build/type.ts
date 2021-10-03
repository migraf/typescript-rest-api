/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {FieldsQueryRecord} from "../fields";
import {FiltersQueryRecord} from "../filters";
import {PaginationQueryRecord} from "../pagination";
import {RelationsQueryRecord} from "../relations";
import {SortQueryRecord} from "../sort";
import {QueryKey} from "../type";

export type QueryBuildOptions = {
    // empty type for now :)
}
export type QueryRecord<R extends Record<string, any>> = {
    [K in QueryKey]?: QueryRecordType<K, R>
}
export type QueryRecordType<T extends QueryKey,
    R extends Record<string, any>> = T extends QueryKey.FIELDS ?
    FieldsQueryRecord<R> :
    T extends QueryKey.FILTER ?
        FiltersQueryRecord<R> :
        T extends QueryKey.INCLUDE ?
            RelationsQueryRecord<R> :
            T extends QueryKey.PAGE ?
                PaginationQueryRecord<R> :
                T extends QueryKey.SORT ?
                    SortQueryRecord<R> :
                    never;
