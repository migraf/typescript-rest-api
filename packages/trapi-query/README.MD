# @trapi/query 🏗

[![main](https://github.com/Tada5hi/typescript-rest-api/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/typescript-rest-api/actions/workflows/main.yml)
[![codecov](https://codecov.io/gh/Tada5hi/typescript-rest-api/branch/main/graph/badge.svg?token=ZUJ8F5TTSX)](https://codecov.io/gh/Tada5hi/typescript-rest-api)
[![Known Vulnerabilities](https://snyk.io/test/github/Tada5hi/typescript-rest-api/badge.svg)](https://snyk.io/test/github/Tada5hi/typescript-rest-api)
[![npm version](https://badge.fury.io/js/@trapi%2Fquery.svg)](https://badge.fury.io/js/@trapi%2Fquery)

This is a library for building `JSON:API` like REST-APIs.
It extends the specification format between request- & response-handling for querying and fetching data according the following parameters:
- `filter`: Filter the data set, according specific criteria.
- `include` Include related resources of the primary data.
- `page` Limit the number of resources returned of the whole set.
- `fields` Return only specific fields or extend the default selection.

**Table of Contents**

- [Installation](#installation)

## Installation

```bash
npm install @trapi/query --save
```

## Usage