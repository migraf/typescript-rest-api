# TRAPI - TypeScript Rest API 🌌

[![main](https://github.com/Tada5hi/typescript-rest-api/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/typescript-rest-api/actions/workflows/main.yml)
[![Known Vulnerabilities](https://snyk.io/test/github/Tada5hi/typescript-rest-api/badge.svg)](https://snyk.io/test/github/Tada5hi/typescript-rest-api)

## What is it?
**TRAPI** is a small collection of few standalone as well helper libraries, to simplify the process of creating REST-APIs and generating documentations.

In most cases, the first thing to do is to generate metadata information by consulting specific REST `decorators` present on your code.
The next step would either be, to generate a `documentation` according to the OpenAPI Specification or to create route schema/handling by using the Metadata for libraries like: express, koa, etc.

## Installation
Please follow the `README.md` instructions in the respective package folder.

## Packages
The repository contains the following packages:

### @trapi/core
[![npm version](https://badge.fury.io/js/@trapi%2Fcore.svg)](https://badge.fury.io/js/@trapi%2Fcore)

This Package contains all core functions, which are also partially required by other modules of this repository.

### @trapi/metadata
[![npm version](https://badge.fury.io/js/@trapi%2Fmetadata.svg)](https://badge.fury.io/js/@trapi%2Fmetadata)

This package contains all functions, to generate metadata for TypeScript REST decorators. 

### @trapi/swagger
[![npm version](https://badge.fury.io/js/@trapi%2Fswagger.svg)](https://badge.fury.io/js/@trapi%2Fswagger)

This package contains all functions, to generate a fully featured documentation according the OpenAPI Specification from given metadata.


