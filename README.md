# TRAPI - TypeScript Rest API 🌌

[![main](https://github.com/Tada5hi/typescript-rest-api/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/typescript-rest-api/actions/workflows/main.yml)
[![codecov](https://codecov.io/gh/Tada5hi/typescript-rest-api/branch/main/graph/badge.svg?token=ZUJ8F5TTSX)](https://codecov.io/gh/Tada5hi/typescript-rest-api)
[![Known Vulnerabilities](https://snyk.io/test/github/Tada5hi/typescript-rest-api/badge.svg)](https://snyk.io/test/github/Tada5hi/typescript-rest-api)

## What is it?
**TRAPI** is a small collection of few standalone as well helper libraries, to simplify the process of creating REST-APIs and generating documentations.

In most cases, the first thing to do is to generate metadata information by consulting self defined or third party REST `decorators` present on your code.
The next step would either be, to generate a `documentation` according to the OpenAPI Specification or to create route schema/handling by using the Metadata for libraries like: express, koa, etc.

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

[README.md](https://github.com/Tada5hi/typescript-rest-api/tree/main/packages/trapi-metadata#README.md)

### @trapi/swagger
[![npm version](https://badge.fury.io/js/@trapi%2Fswagger.svg)](https://badge.fury.io/js/@trapi%2Fswagger)

This package contains all functions, to generate a fully featured documentation according the OpenAPI Specification from given metadata.

[README.md](https://github.com/Tada5hi/typescript-rest-api/tree/main/packages/trapi-swagger#README.md)

### @trapi/data-fetching

### @trapi/utils
[![npm version](https://badge.fury.io/js/@trapi%2Futils.svg)](https://badge.fury.io/js/@trapi%2Futils)

This Package contains all util functions, which are also partially required by other modules of this repository.

[README.md](https://github.com/Tada5hi/typescript-rest-api/tree/main/packages/trapi-utils#README.md)

## Credits

Parts of the code base of the **@trapi/metadata** and **@trapi/swagger** package originates from a continued fork repository ([typescript-swagger](https://github.com/Tada5hi/typescript-swagger)) of the
[typescript-rest-swagger](https://github.com/thiagobustamante/typescript-rest-swagger) library of [thiagobustamante](https://github.com/thiagobustamante)
and was also inspired by the [tsoa](https://github.com/lukeautry/tsoa) library of [lukeatury](https://github.com/lukeautry).
