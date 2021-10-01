/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */


import {buildQuery, formatRequestRecord, RequestRecordKey} from "../../../src";

describe('src/request/utils.ts', () => {
    type ChildEntity = {
        id: number,
        name: string,
        age: number
    }

    type Entity = {
        id: number,
        name: string,
        child: ChildEntity,
        siblings: Entity[]
    }

    it('should format filter record', () => {
        let record = formatRequestRecord<Entity>({
            filter: {
                id: 1,
            }
        });

        expect(record).toEqual(buildQuery({filter: {id: 1}}));

        record = formatRequestRecord<Entity>({
            filter: {
                child: {
                    id: 1
                }
            }
        });

        expect(record).toEqual(buildQuery({filter: {['child.id']: 1}}));

        record = formatRequestRecord<Entity>({
            filter: {
                siblings: {
                    id: 1
                }
            }
        });

        expect(record).toEqual(buildQuery({filter: {['siblings.id']: 1}}));

        record = formatRequestRecord<Entity>({
            filter: {
                id: '!1'
            }
        });

        expect(record).toEqual(buildQuery({filter: {id: '!1'}}));

        record = formatRequestRecord<Entity>({
            filter: {
                id: {
                    operator: '~',
                    value: 1
                }
            }
        });

        expect(record).toEqual(buildQuery({filter: {id: '~1'}}));

        record = formatRequestRecord<Entity>({
            filter: {
                id: {
                    operator: '!~',
                    value: [1,2,3]
                }
            }
        });

        expect(record).toEqual(buildQuery({filter: {id: '!~1,2,3'}}));
    });

    it('should format fields record', () => {
        let record = formatRequestRecord<Entity>({
            fields: 'id'
        });

        expect(record).toEqual(buildQuery({fields: 'id'}));

        record = formatRequestRecord<Entity>({
            fields: ['id', 'name']
        });

        expect(record).toEqual(buildQuery({fields: ['id', 'name']}));

        record = formatRequestRecord<Entity>({
            fields: '+id'
        });

        expect(record).toEqual(buildQuery({fields: '+id'}));

        record = formatRequestRecord<Entity>({
            fields: ['+id', 'name']
        });

        expect(record).toEqual(buildQuery({fields: ['+id', 'name']}));

        record = formatRequestRecord<Entity>({
            fields: {
                default: ['id'],
                child: ['id', 'name']
            }
        });

        expect(record).toEqual(buildQuery({fields: {default: ['id'], child: ['id', 'name']}}));
    });

    it('should format sort record', () => {
        let record = formatRequestRecord<Entity>({
            sort: {
                id: 'DESC'
            }
        });

        expect(record).toEqual(buildQuery({sort: {id: 'DESC'}}));

        record = formatRequestRecord<Entity>({
            sort: '-id'
        });

        expect(record).toEqual(buildQuery({sort: '-id'}));

        record = formatRequestRecord<Entity>({
            sort: ['id', 'name']
        });

        expect(record).toEqual(buildQuery({sort: ['id', 'name']}));

        record = formatRequestRecord<Entity>({
            sort: {
                child: {
                    id: 'DESC'
                }
            }
        });

        expect(record).toEqual(buildQuery({sort: {'child.id': 'DESC'}}));
    });

    it('should format page record', () => {
        let record = formatRequestRecord<Entity>({
            [RequestRecordKey.PAGE]: {
                limit: 10,
                offset: 0
            }
        });

        expect(record).toEqual(buildQuery({[RequestRecordKey.PAGE]: {limit: 10, offset: 0}}));
    });

    it('should format include record', () => {
        let record = formatRequestRecord<Entity>({
            [RequestRecordKey.INCLUDE]: {
                child: true,
                siblings: {
                    child: true
                }
            }
        });

        expect(record).toEqual(buildQuery({[RequestRecordKey.INCLUDE]: ['child', 'siblings.child']}));
    });
});
