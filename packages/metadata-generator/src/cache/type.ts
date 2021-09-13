import {Resolver} from "../resolver/type";
import {Controller} from "../type";

export interface MetadataCacheData {
    sourceFileSize: number;
    controllers: Controller[];
    referenceTypes: Resolver.ReferenceTypes;
}
