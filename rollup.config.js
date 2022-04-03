// eslint-disable-next-line no-unused-vars
const typescript = require('@rollup/plugin-typescript');
const pkg = require('./package.json');
module.exports = [{
    input: './src/index.ts',
    output: [
        {
            name: '@themost/common',
            file: 'dist/index.cjs.js',
            format: 'cjs',
            sourcemap: true
        },
        {
            name: '@themost/common',
            file: 'dist/index.esm.js',
            format: 'esm',
            sourcemap: true
        },
        {
            name: '@themost/common',
            file: 'dist/index.umd.js',
            format: 'umd',
            sourcemap: true
        },
    ],
    external: Object.keys(pkg.dependencies).concat(
        // add extra sub-modules
    ),
    plugins: [
        typescript({ tsconfig: './tsconfig.json' })
    ]
}, {
    input: './platform-server/src/index.ts',
    output: [
        {
            name: '@themost/common/platform-server',
            file: 'platform-server/dist/index.cjs.js',
            format: 'cjs',
            sourcemap: true
        },
        {
            name: '@themost/common/platform-server',
            file: 'platform-server/dist/index.esm.js',
            format: 'esm',
            sourcemap: true
        },
        {
            name: '@themost/common/platform-server',
            file: 'platform-server/dist/index.umd.js',
            format: 'umd',
            sourcemap: true
        },
    ],
    external: Object.keys(pkg.dependencies).concat(
        '@themost/common'
    ),
    plugins: [
        typescript({ tsconfig: './platform-server/tsconfig.json' })
    ]
}];