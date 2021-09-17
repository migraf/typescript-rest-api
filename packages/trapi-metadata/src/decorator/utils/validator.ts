import {array, boolean, lazy, mixed, number, object, SchemaOf, string} from "yup";
import {mapYupRuleForDictionary} from "@trapi/utils";
import {Decorator} from "../type";

let validatorInstance : undefined | SchemaOf<Decorator.Config>;

export function useDecoratorConfigValidator() : SchemaOf<Decorator.Config> {
    if(typeof validatorInstance !== 'undefined') {
        return validatorInstance;
    }

    const configMappingOptionValidator : SchemaOf<Decorator.ConfigMappingOption> = lazy(value => {
        if(typeof value === 'boolean') {
            return boolean();
        }

        if(typeof value === 'string') {
            return string();
        }

        if(Array.isArray(value)) {
            return array().of(string());
        }

        if(Object.prototype.toString.call(value) === '[object Object]') {
            // todo: setup type key check :)
            return object(mapYupRuleForDictionary(value, boolean())).optional().default({});
        }

        return mixed().optional().default(undefined);
    }) as unknown as SchemaOf<Decorator.ConfigMappingOption>;

    const useLibraryValidator : SchemaOf<Decorator.ConfigLibrary> = lazy(value => {
        if(typeof value === 'string') {
            return mixed().oneOf(['typescript-rest', '@decorators/express'] as Decorator.Library[]);
        }

        if(Array.isArray(value)) {
            return array().of(string());
        }

        if(Object.prototype.toString.call(value) === '[object Object]') {
            // todo: setup library key check :)
            return object(mapYupRuleForDictionary(value, configMappingOptionValidator));
        }

        return mixed().optional().default(undefined);
    }) as unknown as SchemaOf<Decorator.ConfigLibrary>;

    const representationPropertyValidator : SchemaOf<Decorator.Property> = object({
        type: mixed().oneOf(['element', 'array'] as Array<Decorator.Property['type']>),
        isType: boolean().optional().default(undefined),
        srcArgumentType: mixed().oneOf(['argument', 'typeArgument'] as Array<Decorator.Property['srcArgumentType']>),
        srcPosition: number().min(0).optional().default(0),
        srcAmount: number().optional().default(undefined),
        // todo: check if 'merge', 'none' or function
        srcStrategy: mixed().optional().default(undefined),
    });

    const representationValidator : SchemaOf<Decorator.Representation<any>> = object({
        id: string().required(),
        properties: lazy(value => {
            if(Object.prototype.toString.call(value) === '[object Object]') {
                return object(mapYupRuleForDictionary(value, representationPropertyValidator)).optional().default({});
            }

            return mixed().optional().default(undefined);
        })
    }) as unknown as SchemaOf<Decorator.Representation<any>>;

    const overrideValidator : SchemaOf<Decorator.TypeRepresentationMap> = lazy(value => {
        if(Object.prototype.toString.call(value) === '[object Object]') {
            return object(mapYupRuleForDictionary(value, lazy(val => {
                    if (Array.isArray(val)) {
                        return array().of(representationValidator);
                    }

                    return representationValidator;
                }))
            );
        }

        return mixed().optional().default(undefined);
    }) as unknown as SchemaOf<Decorator.TypeRepresentationMap>;


    validatorInstance = object({
        library: useLibraryValidator,
        internal: configMappingOptionValidator,
        map: overrideValidator
    }).optional().default({
        library: ['typescript-rest', '@decorators/express'],
        internal: true
    } as Decorator.Config);

    return validatorInstance;
}
