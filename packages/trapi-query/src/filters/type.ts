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
    queryAlias?: string,
    queryBindingKeyFn?: (key: string) => string
};
export type FilterTransformed = {
    statement: string,
    binding: Record<string, any>
};
export type FiltersTransformed = FilterTransformed[];

// -----------------------------------------------------------

type OperatorConfig<V, O> = {
    operator: O,
    value: V | V[]
}

type FilterNegationOperator = '!';
type FilterLikeOperator = '~';
type FilterOperator = FilterNegationOperator | FilterLikeOperator | `${FilterNegationOperator}${FilterLikeOperator}`;

type FilterValue<V> = V extends string | number | boolean ? (V | V[] | FilterValueOperator<V> | Array<FilterValueOperator<V>>) : never;

type FilterValueOperator<V extends string | number | boolean> = `!${V}` | `!~${V}` | `~${V}`;

export type FilterRecord<T> = {
    [K in keyof T]?: T[K] extends OnlyScalar<T[K]> ?
        T[K] | FilterValue<T[K]> | OperatorConfig<T[K], FilterOperator> :
        T[K] extends OnlyObject<T[K]> ? FilterRecord<Flatten<T[K]>> : never
}
