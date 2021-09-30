/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;
type NoArray<Type> = Type extends Array<infer Item> ? never : Type;

type PartialEntity<T> = T extends OnlyEntity<T> ? Partial<T> : T;

type OnlyScalar<T> = T extends string | number | boolean | undefined | null | OnlyEntity<T> ? PartialEntity<T> : never;
type OnlyEntity<T> = T extends { [key: string]: unknown } ? T : never;

type ToOneAndMany<T> = T extends Array<infer Item> ? (Item | Item[]) : (T[] | T);

// -----------------------------------------------------------

type FieldOperatorAdd = '+';
type FieldWithOperators<T> = T extends string ? (`${FieldOperatorAdd}${T}` | T) : never;

// -----------------------------------------------------------

type SortOperatorDesc = '-';
type SortWithOperator<T> = T extends string ? (`${SortOperatorDesc}${T}` | T) : never;

// -----------------------------------------------------------
export type FilterNegationOperator = '!';
export type FilterLikeOperator = '~';
export type FilterOperator = FilterNegationOperator | FilterLikeOperator | `${FilterNegationOperator}${FilterLikeOperator}`;

export type FilterValue<V> = V extends string | number | boolean ? (V | V[] | FilterValueOperator<V> | Array<FilterValueOperator<V>>) : never;
export type FilterValueOperator<V extends string | number | boolean> =  `!${V}` | `!~${V}` | `~${V}`;


export type FilterRecord<T> = {
    [K in keyof T]?: T[K] extends (OnlyScalar<T[K]> | NoArray<T[K]>) ?
        (T[K] extends OnlyEntity<T[K]> ? FilterRecord<T[K]> : (T[K] | FilterValue<T[K]> | OperatorConfig<T[K], FilterOperator>)):
        never
}

export type FieldRecord<T> = {
    [K in keyof T]?: Flatten<T[K]> extends OnlyEntity<Flatten<T[K]>> ? (FieldRecord<Flatten<T[K]>> | FieldWithOperators<keyof T[K]>) : never
} | {
    [key: string]: ToOneAndMany<FieldWithOperators<keyof T>[]>,
} | ToOneAndMany<FieldWithOperators<keyof T>[]>;

export type SortRecord<T> = {
    [K in keyof T]?: T[K] extends OnlyScalar<T[K]> ? (Partial<SortRecord<T[K]>> | 'ASC' | 'DESC'): never
} | SortWithOperator<keyof T> | SortWithOperator<keyof T>[]

export type IncludeRecord<T> = {
    [K in keyof T]?: Flatten<T[K]> extends OnlyEntity<Flatten<T[K]>> ? (IncludeRecord<Flatten<T[K]>> | true) : never
}

export type PageRecord<T> = {
    limit?: number,
    offset?: number
}

// -----------------------------------------------------------

export type OperatorConfig<V, O> = {
    operator: O,
    value: V | V[]
}

// -----------------------------------------------------------

export enum RequestRecordKey {
    FILTER = 'filter',
    FIELDS = 'fields',
    SORT = 'sort',
    INCLUDE = 'include',
    PAGE = 'page'
}

// -----------------------------------------------------------

export type RequestRecord<A extends Record<string, any>> = {
    [RequestRecordKey.FILTER]?: FilterRecord<A>,
    [RequestRecordKey.FIELDS]?: FieldRecord<A>,
    [RequestRecordKey.SORT]?: SortRecord<A>,
    [RequestRecordKey.INCLUDE]?: IncludeRecord<A>,
    [RequestRecordKey.PAGE]?: PageRecord<A>
}
