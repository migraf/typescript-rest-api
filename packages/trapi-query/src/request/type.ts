/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;

type OnlyScalar<T> = T extends string | number | boolean | undefined | null ? T : never;
type OnlySingleObject<T> = T extends { [key: string]: unknown } ? T : never;
type OnlyObject<T> = Flatten<T> extends OnlySingleObject<Flatten<T>> ? T | Flatten<T> : never;

type ToOneAndMany<T> = T extends Array<infer Item> ? (Item | Item[]) : (T[] | T);

type KeyWithOptionalPrefix<T, O extends string> = T extends string ? (`${O}${T}` | T) : never

// -----------------------------------------------------------
type FilterNegationOperator = '!';
type FilterLikeOperator = '~';
type FilterOperator = FilterNegationOperator | FilterLikeOperator | `${FilterNegationOperator}${FilterLikeOperator}`;

type FilterValue<V> = V extends string | number | boolean ? (V | V[] | FilterValueOperator<V> | Array<FilterValueOperator<V>>) : never;
type FilterValueOperator<V extends string | number | boolean> =  `!${V}` | `!~${V}` | `~${V}`;

export type FilterRecord<T> = {
    [K in keyof T]?: T[K] extends OnlyScalar<T[K]> ?
        T[K] | FilterValue<T[K]> | OperatorConfig<T[K], FilterOperator> :
        T[K] extends OnlyObject<T[K]> ? FilterRecord<Flatten<T[K]>> : never
}

// -----------------------------------------------------------

type FieldOperatorAdd = '+';
type FieldWithOperator<T extends Record<string, any>> =
    KeyWithOptionalPrefix<keyof T, FieldOperatorAdd> |
    KeyWithOptionalPrefix<keyof T, FieldOperatorAdd>[];

export type FieldRecord<T> =
    {
        [K in keyof T]?: T[K] extends OnlyObject<T[K]> ?
            (FieldRecord<Flatten<T[K]>> | FieldWithOperator<Flatten<T[K]>>) : never
    } |
    {
        [key: string]: ToOneAndMany<KeyWithOptionalPrefix<keyof T, FieldOperatorAdd>[]>,
    } |
    FieldWithOperator<T>;

// -----------------------------------------------------------

type SortOperatorDesc = '-';
type SortWithOperator<T extends Record<string, any>> =
    KeyWithOptionalPrefix<keyof T, SortOperatorDesc> |
    KeyWithOptionalPrefix<keyof T, SortOperatorDesc>[];

export type SortRecord<T> = {
        [K in keyof T]?: T[K] extends OnlyScalar<T[K]> ?
            'ASC' | 'DESC' :
            T[K] extends OnlyObject<T[K]> ? SortRecord<Flatten<T[K]>> | SortWithOperator<Flatten<T[K]>> : never
    } | SortWithOperator<T>;

// -----------------------------------------------------------

export type IncludeRecord<T extends Record<string, any>> = {
    [K in keyof T]?: T[K] extends OnlyObject<T[K]> ? IncludeRecord<Flatten<T[K]>> | boolean : never
}

// -----------------------------------------------------------

export type PageRecord<T> = {
    limit?: number,
    offset?: number
}

// -----------------------------------------------------------

type OperatorConfig<V, O> = {
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

export type RequestRecord<A extends Record<RequestRecordKey, any>> = {
    filter?: FilterRecord<A>,
    fields?: FieldRecord<A>,
    sort?: SortRecord<A>,
    include?: IncludeRecord<A>,
    page?: PageRecord<A>
}
