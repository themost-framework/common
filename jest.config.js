/** @type {import('ts-jest').JestConfigWithTsJest} **/

const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  globals: {
    'NODE_ENV': 'development'
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  setupFiles: [
    "<rootDir>/jest.setup.js"
  ]
};
