import {
    ArrayLiteralExpression,
    isArrayLiteralExpression,
    Node
} from "typescript";
import {hasOwnProperty} from "@trapi/utils";
import {Decorator} from "../../type";

export function extendRepresentationPropertyConfig(property: Decorator.Property): Decorator.Property {
    if(typeof property.isType === 'undefined') {
        property.isType = false;
    }

    if (typeof property.type === 'undefined') {
        property.type = 'element';
    }

    if (typeof property.srcArgumentType === 'undefined') {
        property.srcArgumentType = 'argument';
    }

    if (
        property.type === 'element' &&
        typeof property.srcPosition === 'undefined'
    ) {
        property.srcPosition = 0;
    }

    return property;
}

export function extractRepresentationPropertyValue<
    T extends Decorator.Type,
    P extends keyof Decorator.TypePropertyMaps[T]
    >(
    decorator: Decorator.Data,
    config: Decorator.Property
): Decorator.TypePropertyMaps[T][P] | undefined {
    let items : unknown[] = [];

    switch (config.srcArgumentType) {
        case 'typeArgument':
            items = decorator.typeArguments;
            break;
        case "argument":
            items = decorator.arguments;
            break;
    }

    if(!config.isType) {
        items = extractValueFromArgumentType(items);
    }

    const srcPosition : number = config.srcPosition ?? 0;
    const srcAmount : number = config.srcAmount ?? 1;

    if (items.length <= srcPosition) {
        switch (config.type) {
            case 'element':
                return undefined;
            case 'array':
                return [] as unknown as Decorator.TypePropertyMaps[T][P];
        }
    }

    const data : unknown[] | unknown[][] = srcAmount >= 1 ? items.slice(srcPosition, srcAmount) : items.slice(srcPosition);

    if(data.length === 0) {
        return (config.type === 'array' ? [] : undefined) as unknown as Decorator.TypePropertyMaps[T][P];
    }

    const srcStrategy : Decorator.PropertyStrategy = config.srcStrategy ?? 'none';

    switch (srcStrategy) {
        case "merge":
            switch (config.type) {
                case 'array':
                    return mergeArrayArguments(data) as unknown as Decorator.TypePropertyMaps[T][P];
                case 'element':
                default:
                    return mergeObjectArguments(data) as Decorator.TypePropertyMaps[T][P];
            }
        case "none":
            // if we dont have any merge strategy, we just return the first argument.
            switch (config.type) {
                case 'array':
                    return (Array.isArray(data[srcPosition]) ? data[srcPosition] : [data[srcPosition]]) as Decorator.TypePropertyMaps[T][P];
                case 'element':
                default:
                    return data[srcPosition] as Decorator.TypePropertyMaps[T][P];
            }
        default:
            if(typeof config.srcStrategy === 'function') {
                return config.srcStrategy(data) as Decorator.TypePropertyMaps[T][P];
            }

            return (config.type === 'array' ? [] : undefined) as unknown as Decorator.TypePropertyMaps[T][P];
    }
}

export function mergeObjectArguments(data: unknown[]) {
    let output : Record<string, any> = {};
    for(let i=0; i<data.length; i++) {
        const prototype = Object.prototype.toString.call(data[i]);
        if(prototype === '[object Object]') {
            output = Object.assign(output, data[i]);
        }
    }

    return output;
}

export function mergeArrayArguments(data: unknown[]) {
    let merged : unknown[] = [];
    for(let i=0; i<data.length; i++) {
        if(Array.isArray(data[i])) {
            merged = [...merged, ...data[i] as unknown[]];
        } else {
            merged.push(data[i]);
        }
    }

    return merged;
}

function extractValueFromArgumentType(argument: unknown[]) {
    const values : unknown[] = [];

    for(let i=0; i<argument.length; i++) {
        if(!hasOwnProperty(argument[i], 'kind')) {
            values.push(argument[i]);
            continue;
        }

        const node : Node = argument[i] as Node;

        switch (true) {
            case isArrayLiteralExpression(node):
                const elements : string[] = [];
                const arrayExpression : ArrayLiteralExpression = node as ArrayLiteralExpression;
                for(let j=0; j < arrayExpression.elements.length; j++) {
                    const element : Record<string, any> = arrayExpression.elements[j];
                    if(hasOwnProperty(element, 'text')) {
                        elements.push(element.text as string);
                    }
                }
                values.push(elements);
                break;
        }
    }

    return values;
}
