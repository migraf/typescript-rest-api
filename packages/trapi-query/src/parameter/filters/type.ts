/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */


import {ParseOutputElementBase, ParseOptionsBase} from "../../parse";
import {Parameter} from "../../type";
import {Flatten, OnlyObject, OnlyScalar} from "../../utils";

// -----------------------------------------------------------
// Build
// -----------------------------------------------------------

export type FilterOperatorConfig<V, O> = {
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

export type FiltersBuildInput<T> = {
    [K in keyof T]?: T[K] extends OnlyScalar<T[K]> ?
        T[K] | FilterValueWithOperator<T[K]> | FilterOperatorConfig<T[K], FilterOperator> :
        T[K] extends OnlyObject<T[K]> ? FiltersBuildInput<Flatten<T[K]>> : never
}

// -----------------------------------------------------------
// Parse
// -----------------------------------------------------------

export type FiltersParseOptions = ParseOptionsBase<Parameter.FILTERS>;

export type FiltersParseOutputElement = ParseOutputElementBase<Parameter.FILTERS, FilterValue<string | number | boolean | null>> & {
    operator?: {
        [K in FilterOperatorLabel]?: boolean
    }
};
export type FiltersParseOutput = FiltersParseOutputElement[];
