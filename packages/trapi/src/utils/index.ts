import {CompilerOptions} from "typescript";
import {createMetadataGenerator, Config as MetadataConfig} from "@trapi/metadata";
import {createSpecGenerator, Specification} from "@trapi/swagger";
import {SwaggerDocFormatData, SwaggerDocFormatType} from "../type";

export async function generateDocumentation(
    config: {
        metadata: MetadataConfig,
        swagger: Specification.Config
    },
    tsConfig?: CompilerOptions | boolean
): Promise<Record<SwaggerDocFormatType, SwaggerDocFormatData>> {
    const metadataGenerator = createMetadataGenerator(config.metadata, tsConfig);

    const metadata = metadataGenerator.generate();

    const specGenerator = createSpecGenerator(config.swagger, metadata);

    specGenerator.build();
    return await specGenerator.save();
}

