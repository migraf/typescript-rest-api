'use strict';

export function normalizePathParameters(path?: string) : string | undefined {
    if (!path) {
        return path;
    }

    let parts = path.split('/');
    parts = parts.map(part => {
        if (isPathParameter(part)) {
            part = `{${clearPathParameter(part)}}`;
        }

        return part;
    });

    return parts.join('/');
}

function isPathParameter(str : string) : boolean {
    return [':', '<', '>'].some(character => str.includes(character));
}

function clearPathParameter(str: string) {
    str = str.replace(/:/g, '');
    str = str.replace(/</g, '');
    str = str.replace(/>/g, '');
    return str;
}
