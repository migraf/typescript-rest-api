import {flattenNestedProperties} from "../utils";
import {SortRecord} from "./type";

export function buildQuerySort<T>(data: SortRecord<T>) {
    switch (true) {
        case typeof data === 'string':
            return data;
        case Array.isArray(data):
            return data;
        default:
            return flattenNestedProperties(data as Record<string, any>);
    }
}
