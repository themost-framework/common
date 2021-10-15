// eslint-disable-next-line no-unused-vars
const dts = require('rollup-plugin-dts').default;
const {babel} = require('@rollup/plugin-babel');
const pkg = require('./package.json');
module.exports = [{
    input: './src/index.js',
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
    external: Object.keys(pkg.dependencies).concat(Object.keys(pkg.peerDependencies)).concat(
        'lodash/repeat',
        'lodash/escape'
    ),
    plugins: [
        babel({
            babelHelpers: 'runtime'
        })
    ]
}, {
    input: './src/index.d.ts',
    output: [{
        file: 'dist/index.d.ts'
    }],
    plugins: [
        dts()
    ],
    external: Object.keys(pkg.dependencies)
        .concat(Object.keys(pkg.peerDependencies))
}];