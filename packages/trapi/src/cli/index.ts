/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

#!/usr/bin/env node
'use strict';

import {ArgumentParser} from 'argparse';
import {CompilerOptions} from "typescript";
import {getConfig} from "../config/utils";
import {createMetadataGenerator} from "@trapi/metadata";
import {createSpecGenerator} from "@trapi/swagger";
import {getCompilerOptions} from "@trapi/utils";
import {Config} from "../config";


const packageJson = require('../../package.json');

const workingDir: string = process.cwd();

const parser = new ArgumentParser({
    addHelp: true,
    description: 'Typescript Swagger tool',
    version: packageJson.version
});

parser.addArgument(
    ['-c', '--config'],
    {
        help: 'The swagger config file (swagger.json or swagger.yml or swaggerConfig.js).'
    }
);

parser.addArgument(
    ['-t', '--tsconfig'],
    {
        defaultValue: true,
        help: 'Load the tsconfig.json file. Read the README.md for more information.'
    }
);

const parameters = parser.parseArgs();

(async () => {
    try {
        const config : Config = await getConfig(workingDir, parameters.config);

        const isBoolean : boolean = parameters.tsconfig === 'true' || parameters.tsconfig === 'false' || typeof parameters.tsconfig === 'boolean';
        const isPath : boolean = !isBoolean && typeof parameters.tsconfig === 'string';

        let compilerOptions : boolean | CompilerOptions | undefined;
        if(isPath) {
            compilerOptions = getCompilerOptions(parameters.tsconfig as string);
        }

        if(isBoolean) {
            const isFalse : boolean = parameters.tsconfig === 'false' || !parameters.tsconfig;
            compilerOptions = !isFalse;
        }

        // todo: config swagger missing :(
        const metadataGenerator = createMetadataGenerator(config.metadata, compilerOptions);

        const metadata = metadataGenerator.generate();

        const specGenerator = createSpecGenerator(metadata, config.swagger);

        specGenerator.build();

        specGenerator.save()
            .then(() => {
                console.log('Swagger file(s) saved to disk.');
                process.exit(0);
            })
            .catch((err: any) => {
                console.log(`Error saving generating swagger. ${err}`);
                process.exit(1);
            });

    } catch (e) {
        console.log('Swagger config not found. Did you specify the path to the swagger config file?');
        process.exit(1);
    }
})();



