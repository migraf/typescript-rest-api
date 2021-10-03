/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {flattenNestedProperties} from "../utils";
import {FieldsQueryRecord} from "./type";

export function buildQueryFields<T>(data: FieldsQueryRecord<T>): Record<string, any> | string | string[] {
    switch (true) {
        case typeof data === 'string':
            return data;
        case Array.isArray(data):
            return data;
        default:
            return flattenNestedProperties(data as Record<string, any>);
    }
}
