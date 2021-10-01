/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */


import {buildQuery, QueryRecordKey} from "../../src";
import {buildURLQueryString} from "../../src/utils";

describe('src/build.ts', () => {
    class ChildEntity {
        id: number;
        name: string;
        age: number;
    }

    type Entity = {
        id: number,
        name: string,
        child: ChildEntity,
        siblings: Entity[]
    }

    it('should build with different query keys', () => {
        let record = buildQuery<Entity>({
            fields: [
                'id',
                'name',
            ],
            filter: {
                id: 1
            },
            include: {
                child: true
            },
            page: {
                limit: 20,
                offset: 0
            },
            sort: '-id'
        }, {
            key: {
                filter: 'filters',
                include: 'includes',
                page: 'pagination',
                fields: 'fields',
                sort: 'sort'
            }
        });

        expect(record).toEqual(buildURLQueryString({
            fields: [
                'id',
                'name',
            ],
            filters: {
                id: 1
            },
            includes: ['child'],
            pagination: {
                limit: 20,
                offset: 0
            },
            sort: '-id'
        }));
    });

    it('should format filter record', () => {
        let record = buildQuery<Entity>({
            filter: {
                id: 1,
            }
        });

        expect(record).toEqual(buildURLQueryString({filter: {id: 1}}));

        record = buildQuery<Entity>({
            filter: {
                child: {
                    id: 1
                }
            }
        });

        expect(record).toEqual(buildURLQueryString({filter: {['child.id']: 1}}));

        record = buildQuery<Entity>({
            filter: {
                siblings: {
                    id: 1
                }
            }
        });

        expect(record).toEqual(buildURLQueryString({filter: {['siblings.id']: 1}}));

        record = buildQuery<Entity>({
            filter: {
                id: '!1'
            }
        });

        expect(record).toEqual(buildURLQueryString({filter: {id: '!1'}}));

        record = buildQuery<Entity>({
            filter: {
                id: {
                    operator: '~',
                    value: 1
                }
            }
        });

        expect(record).toEqual(buildURLQueryString({filter: {id: '~1'}}));

        record = buildQuery<Entity>({
            filter: {
                id: {
                    operator: '!~',
                    value: [1,2,3]
                }
            }
        });

        expect(record).toEqual(buildURLQueryString({filter: {id: '!~1,2,3'}}));
    });

    it('should format fields record', () => {
        let record = buildQuery<Entity>({
            fields: 'id'
        });

        expect(record).toEqual(buildURLQueryString({fields: 'id'}));

        record = buildQuery<Entity>({
            fields: ['id', 'name']
        });

        expect(record).toEqual(buildURLQueryString({fields: ['id', 'name']}));

        record = buildQuery<Entity>({
            fields: '+id'
        });

        expect(record).toEqual(buildURLQueryString({fields: '+id'}));

        record = buildQuery<Entity>({
            fields: ['+id', 'name']
        });

        expect(record).toEqual(buildURLQueryString({fields: ['+id', 'name']}));

        record = buildQuery<Entity>({
            fields: {
                default: ['id'],
                child: ['id', 'name']
            }
        });

        expect(record).toEqual(buildURLQueryString({fields: {default: ['id'], child: ['id', 'name']}}));
    });

    it('should format sort record', () => {
        let record = buildQuery<Entity>({
            sort: {
                id: 'DESC'
            }
        });

        expect(record).toEqual(buildURLQueryString({sort: {id: 'DESC'}}));

        record = buildQuery<Entity>({
            sort: '-id'
        });

        expect(record).toEqual(buildURLQueryString({sort: '-id'}));

        record = buildQuery<Entity>({
            sort: ['id', 'name']
        });

        expect(record).toEqual(buildURLQueryString({sort: ['id', 'name']}));

        record = buildQuery<Entity>({
            sort: {
                child: {
                    id: 'DESC'
                }
            }
        });

        expect(record).toEqual(buildURLQueryString({sort: {'child.id': 'DESC'}}));
    });

    it('should format page record', () => {
        let record = buildQuery<Entity>({
            [QueryRecordKey.PAGE]: {
                limit: 10,
                offset: 0
            }
        });

        expect(record).toEqual(buildURLQueryString({[QueryRecordKey.PAGE]: {limit: 10, offset: 0}}));
    });

    it('should format include record', () => {
        let record = buildQuery<Entity>({
            [QueryRecordKey.INCLUDE]: {
                child: true,
                siblings: {
                    child: true
                }
            }
        });

        expect(record).toEqual(buildURLQueryString({[QueryRecordKey.INCLUDE]: ['child', 'siblings.child']}));
    });
});
