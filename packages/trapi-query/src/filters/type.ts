/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */


import {IncludesTransformed} from "../includes";
import {Flatten, OnlyObject, OnlyScalar} from "../utils";

export type FiltersOptions = {
    aliasMapping?: Record<string, string>,
    allowed?: string[],
    includes?: IncludesTransformed,
    defaultAlias?: string,
    queryBindingKeyFn?: (key: string) => string
};
export type FilterTransformed = {
    key: string,
    alias?: string,
    operator?: {
        [K in FilterOperatorLabel]?: boolean
    },
    value: FilterValue<string | number | boolean | null>
};

export type FiltersTransformed = FilterTransformed[];

// -----------------------------------------------------------

export type OperatorConfig<V, O> = {
    operator: O | O[],
    value: V | V[]
}

export enum FilterOperatorLabel {
    NEGATION = 'negation',
    LIKE = 'like',
    IN = 'in'
}

export enum FilterOperator {
    NEGATION = '!',
    LIKE = '~',
    IN = ','
}

type FilterValue<V> = V extends string | number | boolean ? (V | V[]) : never;
type FilterValueWithOperator<V> = V extends string | number | boolean ? (FilterValue<V> | FilterValueOperator<V> | Array<FilterValueOperator<V>>) : never;

type FilterValueOperator<V extends string | number | boolean> = `!${V}` | `!~${V}` | `~${V}`;

export type FilterRecord<T> = {
    [K in keyof T]?: T[K] extends OnlyScalar<T[K]> ?
        T[K] | FilterValueWithOperator<T[K]> | OperatorConfig<T[K], FilterOperator> :
        T[K] extends OnlyObject<T[K]> ? FilterRecord<Flatten<T[K]>> : never
}
