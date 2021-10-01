import {PaginationOptions, PaginationTransformed} from "./type";

// --------------------------------------------------

function finalizePagination(data: PaginationTransformed, options: PaginationOptions) : PaginationTransformed {
    if (typeof options.maxLimit !== 'undefined') {
        if (
            typeof data.limit === 'undefined' ||
            data.limit > options.maxLimit
        ) {
            data.limit = options.maxLimit;
        }
    }

    if(
        typeof data.limit !== 'undefined' &&
        typeof data.offset === 'undefined'
    ) {
        data.offset = 0;
    }

    return data;
}

/**
 * Transform pagination data to an appreciate data format.
 *
 * @param data
 * @param options
 */
export function parsePagination(
    data: unknown,
    options?: PaginationOptions
) : PaginationTransformed {
    options ??= {};

    const pagination : PaginationTransformed = {};

    const prototype: string = Object.prototype.toString.call(data);
    if (prototype !== '[object Object]') {
        return finalizePagination(pagination, options);
    }

    let {limit, offset} = data as Record<string, any>;

    if (typeof limit !== 'undefined') {
        // tslint:disable-next-line:radix
        limit = parseInt(limit);

        if (!Number.isNaN(limit) && limit > 0) {
            pagination.limit = limit;
        }
    }

    if (typeof offset !== 'undefined') {
        // tslint:disable-next-line:radix
        offset = parseInt(offset);

        if (!Number.isNaN(offset) && offset >= 0) {
            pagination.offset = offset;
        }
    }

    return finalizePagination(pagination, options);
}
