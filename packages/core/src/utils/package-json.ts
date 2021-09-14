import {join} from "path";

let projectPackageJsonpath : string | undefined;
let projectPackageJson : Record<string, any> | undefined;

export function getPackageJsonStringValue(workingDir: string, key: string, defaultValue: string = ''): string {
    const path = join(workingDir, 'package.json');

    try {
        if (
            typeof projectPackageJson === 'undefined' ||
            typeof projectPackageJsonpath === 'undefined' ||
            projectPackageJsonpath !== path
        ) {
            projectPackageJson = require(path);
        }

        projectPackageJsonpath = path;

        return projectPackageJson[key] || defaultValue;
    } catch (e) {
        return defaultValue;
    }
}
