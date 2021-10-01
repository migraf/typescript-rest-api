/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export type PaginationOptions = {
    maxLimit?: number
};
export type PaginationTransformed = {
    limit?: number,
    offset?: number
};

// -----------------------------------------------------------

export type PaginationRecord<T> = {
    limit?: number,
    offset?: number
}
