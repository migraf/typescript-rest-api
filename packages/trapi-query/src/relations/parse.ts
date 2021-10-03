/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import minimatch from 'minimatch';
import {buildObjectFromStringArray} from "../utils";

import {RelationsParseOptions, RelationsParsed} from "./type";

// --------------------------------------------------

// --------------------------------------------------

function includeParents(
    data: string[],
    options: RelationsParseOptions
) : string[] {
    const ret : string[] = [];

    for(let i=0; i<data.length; i++) {
        const parts: string[] = data[i].split('.');

        let value: string = parts.shift();

        /* istanbul ignore next */
        if (
            options.aliasMapping &&
            options.aliasMapping.hasOwnProperty(value)
        ) {
            value = options.aliasMapping[value];
        }

        if(ret.indexOf(value) === -1) {
            ret.push(value);
        }

        while (parts.length > 0) {
            const postValue: string = parts.shift();
            value += '.' + postValue;
            /* istanbul ignore next */
            if (
                options.aliasMapping &&
                options.aliasMapping.hasOwnProperty(value)
            ) {
                value = options.aliasMapping[value];
            }

            if(ret.indexOf(value) === -1) {
                ret.push(value);
            }
        }
    }

    return ret;
}

export function parseRelations(
    data: unknown,
    options?: RelationsParseOptions
): RelationsParsed {
    options ??= {};

    // If it is an empty array nothing is allowed
    if(
        Array.isArray(options.allowed) &&
        options.allowed.length === 0
    ) {
        return [];
    }

    if(options.aliasMapping) {
        options.aliasMapping = buildObjectFromStringArray(options.aliasMapping);
    } else {
        options.aliasMapping = {};
    }

    options.includeParents ??= true;

    let items: string[] = [];

    const prototype: string = Object.prototype.toString.call(data);
    if (
        prototype !== '[object Array]' &&
        prototype !== '[object String]'
    ) {
        return [];
    }

    if (prototype === '[object String]') {
        items = (data as string).split(',');
    }

    if (prototype === '[object Array]') {
        items = (data as any[]).filter(el => typeof el === 'string');
    }

    if(items.length === 0) {
        return [];
    }

    items = items
        .map(item => {
            if (options.aliasMapping.hasOwnProperty(item)) {
                item = options.aliasMapping[item];
            }

            return item;
        });

    if(options.allowed) {
        items = items
            .filter(item => {
                for(let i=0; i<options.allowed.length; i++) {
                    if(minimatch(item, options.allowed[i])) {
                        return true;
                    }
                }

                return false;
            });
    }

    if(options.includeParents) {
        if(Array.isArray(options.includeParents)) {
            const parentIncludes = items.filter(item => item.includes('.') && (options.includeParents as string[]).filter(parent => minimatch(item, parent)).length > 0);
            items.unshift(...includeParents(parentIncludes, options));
        } else {
            items = includeParents(items, options);
        }
    }

    items = Array.from(new Set(items));

    return items
        .map(relation => {
            return {
                key: relation.includes('.') ? relation.split('.').slice(-2).join('.') : (options.defaultAlias ? options.defaultAlias + '.' + relation : relation),
                value: relation.split('.').pop()
            };
        });
}
