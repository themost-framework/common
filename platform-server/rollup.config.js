// eslint-disable-next-line no-unused-vars
const typescript = require('@rollup/plugin-typescript');
const pkg = require('./package.json');
module.exports = [{
    input: './src/index.ts',
    output: [
        {
            name: '@themost/common/platform-server',
            file: 'dist/index.cjs.js',
            format: 'cjs',
            sourcemap: true
        },
        {
            name: '@themost/common/platform-server',
            file: 'dist/index.esm.js',
            format: 'esm',
            sourcemap: true
        },
        {
            name: '@themost/common/platform-server',
            file: 'dist/index.umd.js',
            format: 'umd',
            sourcemap: true
        },
    ],
    external: Object.keys(pkg.dependencies).concat(
        '@themost/common'
    ),
    plugins: [
        typescript({ tsconfig: './tsconfig.json' })
    ]
}];