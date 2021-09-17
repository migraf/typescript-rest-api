import path from "path";

let writableDirPath : string | undefined;
let rootDirPath : string | undefined;

export function getWritableDirPath() {
    if(typeof writableDirPath !== 'undefined') {
        return writableDirPath;
    }

    writableDirPath = path.join(getRootDirPath(), './writable');
    return writableDirPath;
}

export function getRootDirPath() {
    if(typeof rootDirPath !== 'undefined') {
        return rootDirPath;
    }

    rootDirPath = path.resolve(__dirname, '../../');
    return rootDirPath;
}
