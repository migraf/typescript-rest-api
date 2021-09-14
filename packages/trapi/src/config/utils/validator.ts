import {object, SchemaOf} from "yup";
import {useConfigValidator as useMetadataConfigValidator, useDecoratorConfigValidator} from "@trapi/metadata";
import {useConfigValidator as useSwaggerConfigValidator} from "@trapi/swagger";
import {Config} from "../type";

let validatorInstance: undefined | SchemaOf<Config>;

export function useConfigValidator(): SchemaOf<Config> {
    if (typeof validatorInstance !== 'undefined') {
        return validatorInstance;
    }

    validatorInstance = object({
        metadata: useMetadataConfigValidator(),
        swagger: useSwaggerConfigValidator(),
        decorator: useDecoratorConfigValidator()
    });

    return validatorInstance;
}

export async function parseConfig(value: unknown): Promise<Config> {
    const validator = useConfigValidator();

    await validator.validate(value);

    return validator.cast(value) as Config;
}
