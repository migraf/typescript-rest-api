// todo: implement character in regex matching
import {Output, Generator} from "@trapi/metadata";
import {Specification} from "./type";
import {Version2SpecGenerator} from "./v2";
import {Version3SpecGenerator} from "./v3";
import {AbstractSpecGenerator} from "./abstract";

export function removeRepeatingCharacter(str: string, character: string) : string {
    return str.replace('/([^:]\$)\/+/g', "$1");
}

export function removeFinalCharacter(str: string, character: string) {
    while(str.charAt(str.length - 1) === character && str.length > 0) {
        str = str.slice(0, -1);
    }

    return str;
}

export function createSpecGenerator(
    config: Specification.Config,
    metadata: Output | Generator
) {
    const data : Output = metadata instanceof Generator ? metadata.generate() : metadata;

    const outputFormat : Specification.Specification = config.outputFormat || Specification.Specification.VERSION_2;

    let specGenerator : AbstractSpecGenerator<any, any>;

    switch (outputFormat) {
        case Specification.Specification.VERSION_2:
            specGenerator = new Version2SpecGenerator(data, config);
            break;
        case Specification.Specification.VERSION_3:
            specGenerator = new Version3SpecGenerator(data, config);
            break;
    }

    return specGenerator;
}
