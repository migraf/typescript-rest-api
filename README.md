# TRAPI - TypeScript Rest API 🌌

[![main](https://github.com/Tada5hi/typescript-rest-api/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/typescript-rest-api/actions/workflows/main.yml)
[![codecov](https://codecov.io/gh/Tada5hi/typescript-rest-api/branch/main/graph/badge.svg?token=ZUJ8F5TTSX)](https://codecov.io/gh/Tada5hi/typescript-rest-api)
[![Known Vulnerabilities](https://snyk.io/test/github/Tada5hi/typescript-rest-api/badge.svg)](https://snyk.io/test/github/Tada5hi/typescript-rest-api)

## What is it?
**TRAPI** is a small collection of few standalone as well helper libraries, to simplify the process of creating REST-APIs, generating documentations
and communicating between frontend and backend application.

## Installation
Please follow the `README.md` instructions in the respective package folder.

## Packages
The repository contains the following packages:

### trapi
[![npm version](https://badge.fury.io/js/trapi.svg)](https://badge.fury.io/js/trapi)

This is the main package and contains the core functions of all other package and a CLI to interact with them.

[README.md](https://github.com/Tada5hi/typescript-rest-api/tree/main/packages/trapi#README.md)

### @trapi/metadata
[![npm version](https://badge.fury.io/js/@trapi%2Fmetadata.svg)](https://badge.fury.io/js/@trapi%2Fmetadata)

This package contains all functions, to generate metadata for TypeScript REST decorators.
In most cases, the first thing to do is to generate metadata information by consulting self defined or third party REST `decorators` present on your code.
The next step would either be, to generate a `documentation` according to the OpenAPI Specification or to create route schema/handling by using the Metadata for libraries like: express, koa, etc.

[README.md](https://github.com/Tada5hi/typescript-rest-api/tree/main/packages/trapi-metadata#README.md)

### @trapi/query
[![npm version](https://badge.fury.io/js/@trapi%2Fquery.svg)](https://badge.fury.io/js/@trapi%2Fquery)

This is a library for building `JSON:API` like REST-APIs.
It extends the specification format between request- & response-handling for querying and fetching data.

### @trapi/swagger
[![npm version](https://badge.fury.io/js/@trapi%2Fswagger.svg)](https://badge.fury.io/js/@trapi%2Fswagger)

This package contains all functions, to generate a fully featured documentation according the OpenAPI Specification from given metadata.

[README.md](https://github.com/Tada5hi/typescript-rest-api/tree/main/packages/trapi-swagger#README.md)

### @trapi/utils
[![npm version](https://badge.fury.io/js/@trapi%2Futils.svg)](https://badge.fury.io/js/@trapi%2Futils)

This Package contains all util functions, which are also partially required by other modules of this repository.

[README.md](https://github.com/Tada5hi/typescript-rest-api/tree/main/packages/trapi-utils#README.md)
