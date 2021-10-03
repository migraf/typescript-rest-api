import {flattenNestedProperties} from "../utils";
import {RelationsQueryRecord} from "./type";

export function buildQueryIncludes<T>(data: RelationsQueryRecord<T>): string[] {
    const properties: Record<string, boolean> = flattenNestedProperties(data);
    const keys: string[] = Object.keys(properties);

    return Array.from(new Set(keys));
}
