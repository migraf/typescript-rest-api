export type SwaggerDocFormatType = 'yaml' | 'json';

export interface SwaggerDocFormatData {
    path: string;
    name: string;
    content?: string;
}
