/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {Parameter, URLParameter} from "../type";
import {BuildParameterInput} from "./parameter";

export type BuildOptions = {
    // empty type for now :)
}

export type BuildInput<
    V extends Record<string, any>
> = {
    [T in Parameter | URLParameter]?: BuildParameterInput<T, V>
}
