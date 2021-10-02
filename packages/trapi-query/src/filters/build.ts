/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */


import {flattenNestedProperties} from "../utils";
import {FilterOperator, FilterRecord, OperatorConfig} from "./type";

export function buildQueryFilters<T> (data: FilterRecord<T>) : Record<string, string> {
    return flattenNestedProperties(transformOperatorConfigToValue(data));
}

const OperatorWeight = {
    [FilterOperator.NEGATION]: 0,
    [FilterOperator.LIKE]: 50,
    [FilterOperator.IN]: 150
}

function transformOperatorConfigToValue<T>(data: FilterRecord<T>) : FilterRecord<T> {
    if(Object.prototype.toString.call(data) !== '[object Object]') {
        return data as FilterRecord<T>;
    }
    for(let key in (data as Record<string, any>)) {
        if(
            data.hasOwnProperty('operator') &&
            data.hasOwnProperty('value')
        ) {
            const config = data as OperatorConfig<unknown, FilterOperator>;

            if(Array.isArray(config.operator)) {
                (data as any).operator = config.operator
                    .sort((a,b) => {
                        return OperatorWeight[a] <= OperatorWeight[b] ? -1 : 1;
                    })
                    .join('');
            }
        } else {
            (data as any)[key] = transformOperatorConfigToValue(data[key] as Record<string, any>);
        }
    }

    return data;
}
