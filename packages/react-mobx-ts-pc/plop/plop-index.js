const path = require('path');
const plopUtils = require('./utils');

const config = require('./inferred-config');

plopUtils.setGlobal(config);

module.exports = function (plop) {
    plopUtils.loadGenerators(
        path.resolve(__dirname, 'plop-items'),
        plop
    );
};
