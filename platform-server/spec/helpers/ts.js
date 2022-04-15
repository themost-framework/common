const path = require('path');
const project = path.resolve(__dirname, '../../tsconfig.spec.json');
require('ts-node').register({
    project,
    transpileOnly: true
});
