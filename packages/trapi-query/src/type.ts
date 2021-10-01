/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {FieldRecord} from "./fields";
import {FilterRecord} from "./filters";
import {IncludeRecord} from "./includes";
import {PaginationRecord} from "./pagination";
import {SortRecord} from "./sort";

export type BuildQueryKeyOption = {
    [Key in QueryRecordKey]?: string
}

export type QueryBuildOptions = {
    key?: BuildQueryKeyOption
};

// -----------------------------------------------------------

export enum QueryRecordKey {
    FILTER = 'filter',
    FIELDS = 'fields',
    SORT = 'sort',
    INCLUDE = 'include',
    PAGE = 'page'
}

// -----------------------------------------------------------

export type QueryRecord<A extends Record<string, any>> = {
    filter?: FilterRecord<A>,
    fields?: FieldRecord<A>,
    sort?: SortRecord<A>,
    include?: IncludeRecord<A>,
    page?: PaginationRecord<A>
}
