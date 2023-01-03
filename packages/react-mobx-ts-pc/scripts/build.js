// const path = require('path');
const {execSync} = require('child_process');
const shell = require('shelljs');

const {p} = require('../config');

shell.cd(p.root);

// clean
shell.rm('-rf', p.distProd);

// dll
execSync('node ./scripts/dll --mode=production', {stdio: 'inherit'});

// build
// https://github.com/gaearon/react-hot-loader/issues/1112#issuecomment-443351904
// react-hot-loader babel plugin would add some "not pure" code to every file, thus make it completely unshakable.
// Setup NODE_ENV to let babel do the right job
const buildScript = [
    'BABEL_ENV=production NODE_ENV=production',
    'webpack --mode=production --config ./webpack/webpack.config.js',
].join(' ');
execSync(buildScript, {stdio: 'inherit'});
