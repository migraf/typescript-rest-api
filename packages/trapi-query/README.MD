# @trapi/query 🌈

[![main](https://github.com/Tada5hi/typescript-rest-api/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/typescript-rest-api/actions/workflows/main.yml)
[![codecov](https://codecov.io/gh/Tada5hi/typescript-rest-api/branch/main/graph/badge.svg?token=ZUJ8F5TTSX)](https://codecov.io/gh/Tada5hi/typescript-rest-api)
[![Known Vulnerabilities](https://snyk.io/test/github/Tada5hi/typescript-rest-api/badge.svg)](https://snyk.io/test/github/Tada5hi/typescript-rest-api)
[![npm version](https://badge.fury.io/js/@trapi%2Fquery.svg)](https://badge.fury.io/js/@trapi%2Fquery)

This is a library for building `JSON:API` like REST-APIs.

It extends the specification format between request- & response-handling for querying and fetching data according the following query parameters:
- `fields` Return only specific fields or extend the default selection.
- `filter`: Filter the data set, according specific criteria.
- `include` Include related resources of the primary data.
- `page` Limit the number of resources returned of the whole set.
- `sort` Sort the resources according one or more keys in asc/desc direction.

---
**Important NOTE**

The examples in the [Parsing](#parsing-) section, are not available with current release of the `typeorm-extension@0.3.0` library.

---

**Table of Contents**

- [Installation](#installation)
- [Usage](#usage)
  - [Build](#build-)
  - [Parsing](#parsing-)
- [Functions](#functions)
  - [buildQuery](#buildquery)
  - [parseQuery](#parsequery)
- [Types](#types)
  - [Key](#key)
      - [QueryKey](#querykey)
      - [QueryKeyOption](#querykeyoption)
  - [Record](#record)
    - [QueryRecord](#queryrecord)
  - [Parse](#parse)
    - [QueryParseOption](#queryparseoptions)
    - [QueryParseOutput](#queryparseoutput)
  - [Parsed](#parsed)
      - [FieldsParsed](#fieldsparsed)
      - [FiltersParsed](#filtersparsed)
      - [IncludeParsed](#includesparsed)
      - [PaginationParsed](#paginationparsed)
      - [SortParsed](#sortparsed)
  - [Options](#options)
      - [FieldsOptions](#fieldsoptions)
      - [FiltersOptions](#filtersoptions)
      - [IncludeOptions](#includesoptions)
      - [PaginationOptions](#paginationoptions)
      - [SortOptions](#sortoptions)

## Installation

```bash
npm install @trapi/query --save
```

## Usage

### Build 🏗

The general idea is to construct a `QueryRecord` at the frontend side, which will be formatted to a string and passed to the backend application as URL query string.
The backend application is than always fully capable of processing the request, as far the provided query was not malformed.

Therefore, two components of this module are required in the frontend application:
- generic type: `QueryRecord<T>`
- function: `buildQuery`.

The method will generate the query string, which was addressed in the previous section.

In the following example a Class which will represent the structure of a `User`.
The `getAPIUsers` will handle the resource request to the resource API.

```typescript
import axios from "axios";
import {QueryRecord, buildQuery} from "@trapi/query";

class Profile {
    id: number;
    avatar: string;
    cover: string;
}

class User {
    id: number;
    name: string;
    age?: number;
    profile: Profile;
}

type ResponsePayload = {
    data: User[],
    meta: {
        limit: number,
        offset: number,
        total: number
    }
}

export async function getAPIUsers(record: QueryRecord<User>): Promise<ResponsePayload> {
    const response = await axios.get('users' + buildQuery(record));

    return response.data;
}

(async () => {
    const record: QueryRecord<User> = {
        page: {
            limit: 20,
            offset: 10
        },
        filter: {
            id: 1 // some possible values:
            // 1 | [1,2,3] | '!1' | '~1' | ['!1',2,3] | {profile: {avatar: 'xxx.jpg'}}
        },
        fields: ['id', 'name'], // some possible values:
        // 'id' | ['id', 'name'] | '+id' | {user: ['id', 'name'], profile: ['avatar']}
        sort: '-id', // some possible values:
        // 'id' | ['id', 'name'] | '-id' | {id: 'DESC', profile: {avatar: 'ASC'}}
        include: {
            profile: true
        }
    };

    const query = buildQuery(record);

    // console.log(query);
    // ?filter[id]=1&fields=id,name&page[limit]=20&page[offset]=10&sort=-id&include=profile

    let response = await getAPIUsers(record);

    // do somethin with the response :)
})();
```

The next examples will be about how to parse and validate the transformed `QueryRecord<T>` on the backend side.

### Parsing 🔎
For explanation proposes how to use the query utils,
two simple entities with a simple relation between them are declared to demonstrate their usage:

```typescript
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn
} from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column({type: 'varchar', length: 30})
    @Index({unique: true})
    name: string;

    @Column({type: 'varchar', length: 255, default: null, nullable: true})
    email: string;

    @OneToOne(() => Profile)
    profile: Profile;
}

@Entity()
export class Profile {
    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column({type: 'varchar', length: 255, default: null, nullable: true})
    avatar: string;

    @Column({type: 'varchar', length: 255, default: null, nullable: true})
    cover: string;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;
}
```
In this example [typeorm](https://www.npmjs.com/package/typeorm) is used as the object-relational mapping (ORM) and [typeorm-extension](https://www.npmjs.com/package/typeorm-extension) is used
to apply the parsed request query parameters on the db query.

When you use [express](https://www.npmjs.com/package/express) or another library, you can use the API utils accordingly to the
following code snippet:

#### Parse - In Detail

```typescript
import {getRepository} from "typeorm";
import {Request, Response} from 'express';

import {
    parseFields,
    parseFilters,
    parseIncludes,
    parsePagination,
    parseSort,
    QueryKey
} from "@trapi/query";

import {
    applyParsed
} from "typeorm-extension";

/**
 * Get many users.
 *
 * Request example
 * - url: /users?page[limit]=10&page[offset]=0&include=profile&filter[id]=1&fields[user]=id,name
 *
 * Return Example:
 * {
 *     data: [
 *         {id: 1, name: 'tada5hi', profile: {avatar: 'avatar.jpg', cover: 'cover.jpg'}}
 *      ],
 *     meta: {
 *        total: 1,
 *        limit: 20,
 *        offset: 0
 *    }
 * }
 * @param req
 * @param res
 */
export async function getUsers(req: Request, res: Response) {
    const {fields, filter, include, page, sort} = req.query;

    const repository = getRepository(User);
    const query = repository.createQueryBuilder('user');

    // -----------------------------------------------------

    const includesParsed = parseIncludes(include, {
        allowed: 'profile'
    });

    const fieldsParsed = parseFields(fields, {
        defaultAlias: 'user',
        allowed: ['id', 'name', 'profile.id', 'profile.avatar'],
        // profile.id can only be used as sorting key, if the relation 'profile' is included.
        includes: includesParsed
    });

    const filterParsed = parseFilters(filter, {
        defaultAlias: 'user',
        allowed: ['id', 'name', 'profile.id'], // profile.id can only be used as sorting key, if the relation 'profile' is included.
        includes: includesParsed
    });

    const pageParsed = parsePagination(page, {
        maxLimit: 20
    });

    const sortParsed = parseSort(sort, {
        defaultAlias: 'user',
        allowed: ['id', 'name', 'profile.id'], // profile.id can only be used as sorting key, if the relation 'profile' is included.
        includes: includesParsed
    });

    const parsed = applyParsed(query, {
        [QueryKey.FIELDS]: fieldsParsed,
        // only allow filtering users by id & name
        [QueryKey.FILTER]: filterParsed,
        [QueryKey.INCLUDE]: includesParsed,
        // only allow to select 20 items at maximum.
        [QueryKey.PAGE]: pageParsed,
        [QueryKey.SORT]: sortParsed
    });

    // -----------------------------------------------------

    const [entities, total] = await query.getManyAndCount();

    return res.json({
        data: {
            data: entities,
            meta: {
                total,
                ...parsed[QueryKey.PAGE]
            }
        }
    });
}
```

```typescript
import {getRepository} from "typeorm";
import {Request, Response} from 'express';

import {
    parseQuery,
    QueryKey,
    QueryParseOutput
} from "@trapi/query";

import {
    applyParsed
} from "typeorm-extension";

/**
 * Get many users.
 *
 * Request example
 * - url: /users?page[limit]=10&page[offset]=0&include=profile&filter[id]=1&fields[user]=id,name
 *
 * Return Example:
 * {
 *     data: [
 *         {id: 1, name: 'tada5hi', profile: {avatar: 'avatar.jpg', cover: 'cover.jpg'}}
 *      ],
 *     meta: {
 *        total: 1,
 *        limit: 20,
 *        offset: 0
 *    }
 * }
 * @param req
 * @param res
 */
export async function getUsers(req: Request, res: Response) {
    const {fields, filter, include, page, sort} = req.query;

    const output: QueryParseOutput = parseQuery({
        [QueryKey.FIELDS]: {
            defaultAlias: 'user',
            allowed: ['id', 'name', 'profile.id', 'profile.avatar']
        },
        [QueryKey.FILTER]: {
            defaultAlias: 'user',
            allowed: ['id', 'name', 'profile.id']
        },
        [QueryKey.INCLUDE]: {
            allowed: ['profile']
        },
        [QueryKey.PAGE]: {
            maxLimit: 20
        },
        [QueryKey.SORT]: {
            defaultAlias: 'user',
            allowed: ['id', 'name', 'profile.id']
        }
    });

    const repository = getRepository(User);
    const query = repository.createQueryBuilder('user');

    // -----------------------------------------------------

    const parsed = applyParsed(query, output);

    // -----------------------------------------------------

    const [entities, total] = await query.getManyAndCount();

    return res.json({
        data: {
            data: entities,
            meta: {
                total,
                ...pagination
            }
        }
    });
}
```

#### Parse - Third Party Library

It can even be much easier to parse the query key values, because `typeorm-extension` uses `@trapi/query` under the hood ⚡.
This is much shorter than the previous example and has less direct dependencies 😁.

```typescript
import {getRepository} from "typeorm";
import {Request, Response} from 'express';
import {
    applyFields,
    applyFilters,
    applyIncludes,
    applyPagination,
    applySort
} from "typeorm-extension";

/**
 * Get many users.
 *
 * Request example
 * - url: /users?page[limit]=10&page[offset]=0&include=profile&filter[id]=1&fields[user]=id,name
 *
 * Return Example:
 * {
 *     data: [
 *         {id: 1, name: 'tada5hi', profile: {avatar: 'avatar.jpg', cover: 'cover.jpg'}}
 *      ],
 *     meta: {
 *        total: 1,
 *        limit: 20,
 *        offset: 0
 *    }
 * }
 * @param req
 * @param res
 */
export async function getUsers(req: Request, res: Response) {
    const {fields, filter, include, page, sort} = req.query;

    const repository = getRepository(User);
    const query = repository.createQueryBuilder('user');

    // -----------------------------------------------------

    const includes = applyIncludes(query, include, {
        defaultAlias: 'user',
        allowed: ['profile']
    });

    applySort(query, sort, {
        defaultAlias: 'user',
        allowed: ['id', 'name', 'profile.id'],
        // profile.id can only be used as sorting key, if the relation 'profile' is included.
        includes: includes
    });

    applyFields(query, fields, {
        defaultAlias: 'user',
        allowed: ['id', 'name', 'profile.id', 'profile.avatar'],
        // porfile fields can only be included, if the relation 'profile' is included.
        includes: includes
    })

    // only allow filtering users by id & name
    applyFilters(query, filter, {
        defaultAlias: 'user',
        allowed: ['id', 'name', 'profile.id'],
        // porfile.id can only be used as a filter, if the relation 'profile' is included.
        includes: includes
    });

    // only allow to select 20 items at maximum.
    const pagination = applyPagination(query, page, {maxLimit: 20});

    // -----------------------------------------------------

    const [entities, total] = await query.getManyAndCount();

    return res.json({
        data: {
            data: entities,
            meta: {
                total,
                ...pagination
            }
        }
    });
}
```

## Functions

## buildQuery

▸ `function` **buildQuery**<`T`>(`record: QueryRecord<T>`, `options?: QueryBuildOptions`): `string`

Build a query string from a provided [QueryRecord](#queryrecord).

#### Example
**`Simple`**

```typescript
// Only drop database if it does exists.
import {buildQuery, QueryKey} from "@trapi/query";

type User = {
    id: number,
    name: string,
    age?: number
}

const query: string = buildQuery<T>({
    [QueryKey.FIELDS]: ['+age'],
    [QueryKey.FILTER]: {
        name: '~pe'
    }
});

console.log(query);
// ?fields=+age&filter[name]=~pe
```

#### Type parameters

| Name | Description |
| :------ | :------ |
| `T` | A type, interface, or class which represent the data structure.


#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `record` | `QueryRecord`<`T`> | Query specification [more](#record). |
| `options` | `QueryBuildOptions` | Options for building fields, filter, include, ... query [more](#fieldsoptions)

#### Returns

`string`

The function return a string, which can be parsed with the [parseQuery](#parsequery) function.

I.e. `/users?page[limit]=10&page[offset]=0&include=profile&filter[id]=1&fields[user]=id,name`

## parseQuery

▸ `function` **parseQuery**<`T`>(`input: QueryParseInput`, `options?: QueryParseOptions`): `QueryParseOutput`

Parse a query string to an efficient data structure ⚡. The output will
be an object with each possible value of the [QueryKey](#querykey) enum as property key and the
parsed data as value.

#### Example
**`Simple`**

```typescript
// Only drop database if it does exists.
import {
    FieldOperator,
    FilterOperator,
    parseQuery,
    QueryParseOutput
} from "@trapi/query";

const output: QueryParseOutput = parseQuery({
    [QueryKey.FIELDS]: ['+age'],
    [QueryKey.FILTER]: {
        name: '~pe'
    }
});

console.log(output);
//{
//    fields: [
//        {key: 'age', operator: FieldOperator.INCLUDE}
//    ],
//    filter: [
//        {key: 'name', value: 'pe', operator: FilterOperator.LIKE}
//   ]
//}
```

#### Type parameters

| Name | Description |
| :------ | :------ |


#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `QueryParseInput` | Query input data passed i.e. via URL [more](#queryparseinput). |
| `options` | `QueryParseOptions` | Options for parsing fields, filter, include, ... [more](#queryparseoptions)

#### Returns

[QueryParseOutput](#queryparseoutput)

The function return an object.
## Types

### Key
#### QueryKey
```typescript
export enum QueryKey {
    FILTER = 'filter',
    FIELDS = 'fields',
    SORT = 'sort',
    INCLUDE = 'include',
    PAGE = 'page'
}
```

#### QueryKeyOption
```typescript
export type QueryKeyOption<T extends QueryKey> = T extends QueryKey.FIELDS ?
        FieldsOptions :
    T extends QueryKey.FILTER ?
            FiltersOptions :
        T extends  QueryKey.INCLUDE ?
                IncludesOptions :
            T extends QueryKey.PAGE ?
                    PaginationOptions :
                T extends QueryKey.SORT ?
                        SortOptions :
                        never;
```

### Record
#### QueryRecord
```typescript
export type QueryRecord<R extends Record<string, any>> = {
    [K in QueryKey]?: QueryRecordType<K,R>
}

export type QueryRecordType<
    T extends QueryKey,
    R extends Record<string, any>
    > = T extends QueryKey.FIELDS ?
    FilterRecord<R> :
    T extends QueryKey.FILTER ?
        FieldRecord<R> :
        T extends QueryKey.INCLUDE ?
            IncludeRecord<R> :
            T extends QueryKey.PAGE ?
                PaginationRecord<R> :
                T extends QueryKey.SORT ?
                    SortRecord<R> :
                    never;
```

#### QueryRecordParsed
```typescript
export type QueryRecordParsed<T extends QueryKey> =
    T extends QueryKey.FIELDS ?
    FieldsParsed :
    T extends QueryKey.FILTER ?
        FiltersParsed :
        T extends QueryKey.INCLUDE ?
            IncludesParsed :
            T extends QueryKey.PAGE ?
                PaginationParsed :
                T extends QueryKey.SORT ?
                    SortParsed :
                    never;
```

### Parse
#### QueryParseOptions
```typescript
export type QueryParseOptions = {
    /**
     * On default all query keys are enabled.
     */
    [K in QueryKey]?: QueryKeyOption<K> | boolean
}
```

#### QueryParseInput
```typescript
export type QueryParseOutput = {
    [K in QueryKey]?: any
}
```

#### QueryParseOutput
```typescript
export type QueryParseOutput = {
    [K in QueryKey]?: QueryRecordParsed<K>
}
```

### Parsed

#### FieldsParsed

```typescript
export enum FieldOperator {
    INCLUDE = '+',
    EXCLUDE = '-'
}

export type FieldParsed = {
    key: string,
    alias?: string,
    operator?: FieldOperator
};

export type FieldsParsed = FieldParsed[];
```

#### FiltersParsed

```typescript
export enum FilterOperatorLabel {
    NEGATION = 'negation',
    LIKE = 'like',
    IN = 'in'
}

export type FilterParsed = {
    key: string,
    alias?: string,
    operator?: {
        [K in FilterOperatorLabel]?: boolean
    },
    value: FilterValue<string | number | boolean | null>
};

export type FiltersParsed = FilterParsed[];
```

#### IncludesParsed

```typescript
export type IncludeParsed = {
    property: string,
    alias: string
};
export type IncludesParsed = IncludeParsed[];
```

#### PaginationParsed

```typescript
export type PaginationParsed = {
    limit?: number,
    offset?: number
};
```

#### SortParsed

```typescript
export enum SortDirection {
    ASC = 'ASC',
    DESC = 'DESC'
}

export type SortElementParsed = {
    alias?: string,
    key: string,
    value: SortDirection
}
export type SortParsed = SortElementParsed[];
```

### Options

#### FieldsOptions
```typescript
export type FieldsOptions = {
    aliasMapping?: Record<string, string>,
    allowed?: Record<string, string[]> | string[],
    includes?: IncludesParsed,
    defaultAlias?: string
};
```

#### FiltersOptions
```typescript
export type FiltersOptions = {
    aliasMapping?: Record<string, string>,
    allowed?: string[],
    includes?: IncludesParsed,
    defaultAlias?: string,
    queryBindingKeyFn?: (key: string) => string
};
```

#### IncludesOptions
```typescript
export type IncludesOptions = {
    aliasMapping?: Record<string, string>,
    allowed?: string[],
    includeParents?: boolean | string[] | string
    defaultAlias?: string,
};
```

#### PaginationOptions
```typescript
export type PaginationOptions = {
    maxLimit?: number
};
```

#### SortOptions
```typescript
export type SortOptions = {
    aliasMapping?: Record<string, string>,
    allowed?: string[] | string[][],
    includes?: IncludesParsed,
    defaultAlias?: string
};
```
