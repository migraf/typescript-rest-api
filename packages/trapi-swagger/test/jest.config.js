module.exports = {
    testEnvironment: 'node',
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    moduleFileExtensions: [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node",
    ],
    testRegex: '(/unit/.*|(\\.|/)(test|spec))\\.(ts|js)x?$',
    testPathIgnorePatterns: [
        "writable",
        "dist",
        "/unit/mock-util.ts"
    ],
    coverageDirectory: 'writable/coverage',
    collectCoverageFrom: [
        'src/**/*.{ts,tsx,js,jsx}',
        '!src/**/*.d.ts',
        '!src/**/validator.ts'
    ],
    coverageThreshold: {
        global: {
            branches: 58,
            functions: 77,
            lines: 70,
            statements: 70
        }
    },
    rootDir: '../',
    verbose: true
};
