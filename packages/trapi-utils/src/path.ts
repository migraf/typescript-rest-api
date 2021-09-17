'use strict';

export function normalizePath(str: string) : string {
    // remove slashes
    str = str.replace(/^[/\\\s]+|[/\\\s]+$/g, '');

    str = str.replace(/([^:]\/)\/+/g, "$1");

    return str;
}

export function normalizePathParameters(str: string) : string {
    // <:id> -> {id}
    str = str.replace(/<:([^\/]+)>/g, '{$1}');

    // :id -> {id}
    str = str.replace(/:([^\/]+)/g, '{$1}');

    // <id> -> {id}
    str = str.replace(/<([^\/]+)>/g, '{$1}');

    return str;
}
