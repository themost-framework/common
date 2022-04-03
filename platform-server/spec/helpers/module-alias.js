const {addAliases} = require('module-alias');
const path = require('path');
addAliases({
    '@themost/common': path.resolve(__dirname, '../../../src/index')
});