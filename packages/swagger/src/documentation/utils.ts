import {CompilerOptions} from "typescript";
import {createMetadataGenerator, Config as MetadataConfig} from "@trapi/metadata";
import {createSpecGenerator, Specification} from "../specification";
import {SwaggerDocumentationFormatData, SwaggerDocumentationFormatType} from "./type";

export async function generateDocumentation(
    config: {
        metadata: MetadataConfig,
        swagger: Specification.Config
    },
    tsConfig?: CompilerOptions | boolean
): Promise<Record<SwaggerDocumentationFormatType, SwaggerDocumentationFormatData>> {
    const metadataGenerator = createMetadataGenerator(config.metadata, tsConfig);

    const metadata = metadataGenerator.generate();

    const specGenerator = createSpecGenerator(config.swagger, metadata);

    specGenerator.build();
    return await specGenerator.save();
}

