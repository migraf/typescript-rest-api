/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {Decorator, Config as MetadataConfig} from "@trapi/metadata";
import {Specification} from "@trapi/swagger";

export interface Config {
    /**
     * Swagger generation configuration object.
     */
    swagger: Specification.Config;

    /**
     * Configuration for the metadata collection.
     */
    metadata: MetadataConfig;

    /**
     * Decorator config for decorator representations.
     */
    decorator?: Decorator.Config;
}
