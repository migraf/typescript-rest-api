import {flattenNestedProperties} from "../utils";
import {IncludeRecord} from "./type";

export function buildQueryIncludes<T>(data: IncludeRecord<T>): string[] {
    const properties: Record<string, boolean> = flattenNestedProperties(data);
    const keys: string[] = Object.keys(properties);

    return Array.from(new Set(keys));
}
