import Lazy from "yup/lib/Lazy";
import Reference from "yup/lib/Reference";
import {AnySchema} from "yup/lib/schema";

export function mapYupRuleForDictionary<T>(map: any, rule: T) : Record<string, AnySchema | Reference | Lazy<any, any>> {
    return Object.keys(map).reduce((newMap, key) => ({
        ...newMap,
        [key]: rule
    }), {});
}
