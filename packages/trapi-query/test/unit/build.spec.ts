/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */


import {buildQuery, FilterOperator, QueryKey, SortDirection} from "../../src";
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
                    operator: FilterOperator.LIKE,
                    value: 1
                }
            }
        });

        expect(record).toEqual(buildURLQueryString({filter: {id: '~1'}}));

        record = buildQuery<Entity>({
            filter: {
                id: {
                    operator: [
                        FilterOperator.NEGATION,
                        FilterOperator.LIKE
                    ],
                    value: [1,2,3]
                }
            }
        });

        expect(record).toEqual(buildURLQueryString({filter: {id: '!~1,2,3'}}));

        // with wrong operator order :)
        record = buildQuery<Entity>({
            filter: {
                id: {
                    operator: [
                        FilterOperator.LIKE,
                        FilterOperator.NEGATION
                    ],
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
                id: SortDirection.DESC
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
                    id: SortDirection.DESC
                }
            }
        });

        expect(record).toEqual(buildURLQueryString({sort: {'child.id': 'DESC'}}));
    });

    it('should format page record', () => {
        let record = buildQuery<Entity>({
            [QueryKey.PAGE]: {
                limit: 10,
                offset: 0
            }
        });

        expect(record).toEqual(buildURLQueryString({[QueryKey.PAGE]: {limit: 10, offset: 0}}));
    });

    it('should format include record', () => {
        let record = buildQuery<Entity>({
            [QueryKey.INCLUDE]: {
                child: true,
                siblings: {
                    child: true
                }
            }
        });

        expect(record).toEqual(buildURLQueryString({[QueryKey.INCLUDE]: ['child', 'siblings.child']}));
    });
});
