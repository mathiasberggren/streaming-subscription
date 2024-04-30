/* eslint-disable */
export default {
  displayName: 'api',
  testEnvironment: 'node',
  transform: {
    "^.+\\.(t|j)s?$": [
      "@swc/jest",
      {
        jsc: {
          parser: {
            syntax: "typescript",
            decorators: true,
            dynamicImport: true
          },
          transform: {
            legacyDecorator: true,
            decoratorMetadata: true
          },
        },
      }
    ]
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/api',
};
