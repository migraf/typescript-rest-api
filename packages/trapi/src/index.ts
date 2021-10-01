/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {setFlagsFromString} from "v8";

export * from './cli';
export * from './utils';

export {createMetadataGenerator, MetadataGenerator, generateMetadata} from '@trapi/metadata';
export {RequestRecord, formatRequestRecord} from "@trapi/query";
export {createSpecGenerator, Version3SpecGenerator, Version2SpecGenerator, Specification} from "@trapi/swagger";
