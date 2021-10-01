/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {hasOwnProperty} from "../utils";
import {AliasFields, DEFAULT_ALIAS_ID, FieldsOptions, FieldsTransformed} from "./type";

// --------------------------------------------------

// --------------------------------------------------

export function buildDomainFields(
    data: Record<string, string[]> | string[],
    options?: FieldsOptions
) {
    options = options ?? {queryAlias: DEFAULT_ALIAS_ID};

    let domainFields : Record<string, string[]> = {};

    if(Array.isArray(data)) {
        domainFields[options.queryAlias] = data;
    } else {
        domainFields = data;
    }

    return domainFields;
}

export function parseFields(
    data: unknown,
    options: FieldsOptions
): FieldsTransformed {
    options ??= {};

    // If it is an empty array nothing is allowed
    if(
        typeof options.allowed !== 'undefined' &&
        Object.keys(options.allowed).length === 0
    ) {
        return [];
    }

    options.aliasMapping ??= {};
    options.includes ??= [];
    options.queryAlias ??= DEFAULT_ALIAS_ID;

    let allowedDomainFields : Record<string, string[]> | undefined;
    if(options.allowed) {
        allowedDomainFields = buildDomainFields(options.allowed, options);
    }

    const prototype: string = Object.prototype.toString.call(data);
    if (
        prototype !== '[object Object]' &&
        prototype !== '[object Array]' &&
        prototype !== '[object String]'
    ) {
        return [];
    }

    if(prototype === '[object String]') {
        data = {[options.queryAlias]: data};
    }

    if(prototype === '[object Array]') {
        data = {[options.queryAlias]: data};
    }

    const transformed : FieldsTransformed = [];

    for (const key in (data as Record<string, string[]>)) {
        if (!data.hasOwnProperty(key) || typeof key !== 'string') {
            continue;
        }

        const value : unknown = (data as Record<string, string[]>)[key];

        const valuePrototype : string = Object.prototype.toString.call(value);
        if (
            valuePrototype !== '[object Array]' &&
            valuePrototype !== '[object String]'
        ) {
            continue;
        }

        let fields : string[] = [];

        /* istanbul ignore next */
        if(valuePrototype === '[object String]') {
            fields = (value as string).split(',');
        }

        /* istanbul ignore next */
        if(valuePrototype === '[object Array]') {
            fields = (value as unknown[])
                .filter(val => typeof val === 'string') as string[];
        }

        let fieldsAppend : boolean | undefined;
        for(let i=0; i<fields.length; i++) {
            if(fields[i].substr(0, 1) === '+') {
                fieldsAppend = true;

                fields[i] = fields[i].substr(1);
            }
        }

        if(fields.length === 0) continue;

        const allowedDomains : string[] = typeof allowedDomainFields !== 'undefined' ? Object.keys(allowedDomainFields) : [];
        const targetKey : string = allowedDomains.length === 1 ? allowedDomains[0] : key;

        // is not default domain && includes are defined?
        if(
            key !== DEFAULT_ALIAS_ID &&
            key !== options.queryAlias &&
            typeof options.includes !== 'undefined'
        ) {
            const includesMatched = options.includes.filter(include => include.alias === key);
            if(includesMatched.length === 0) {
                continue;
            }
        }

        fields = fields
            .map(part => {
                const fullKey : string = key + '.' + part;

                return options.aliasMapping.hasOwnProperty(fullKey) ? options.aliasMapping[fullKey].split('.').pop() : part;
            })
            .filter(part => {
                if(typeof allowedDomainFields === 'undefined') {
                    return true;
                }

                return hasOwnProperty(allowedDomainFields, targetKey) &&
                    allowedDomainFields[targetKey].indexOf(part) !== -1;
            });

        if(fields.length > 0) {
            const item : AliasFields = {
                fields: fields
            };

            if(targetKey !== DEFAULT_ALIAS_ID) {
                item.alias = targetKey;
            }

            if(typeof fieldsAppend !== 'undefined') {
                item.addFields = fieldsAppend;
            }

            transformed.push(item);
        }
    }

    return transformed;
}
