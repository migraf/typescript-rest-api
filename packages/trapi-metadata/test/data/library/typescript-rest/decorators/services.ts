/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export function Path(path: string) {
    return (...args) => { return; };
}

export function Security(roles?: string | Array<string>, name?: string) {
    return (...args) => { return; };
}

export function PreProcessor<T>(preprocessor: T) {
    return () => { return; };
}

export function PostProcessor<T>(preprocessor: T) {
    return () => { return; };
}

export function AcceptLanguage(...languages: Array<string>) {
    return () => { return; };
}

export function Accept(...accepts: Array<string>) {
    return (...args) => { return; };
}

export function BodyOptions(options: any) {
    return () => { return; };
}

export function BodyType<T>(type: T) {
    return () => { return; };
}

export function IgnoreNextMiddlewares(...args: Array<any>) {
    return () => { return; };
}

// like SWAGGER_HIDDEN
export function Abstract(...args: Array<any>) {
    return () => { return; };
}
