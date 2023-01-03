// const path = require('path');
const {execSync} = require('child_process');
const shell = require('shelljs');
const {p} = require('../config');

shell.cd(p.root);

const devScript = [
    'BABEL_ENV=development NODE_ENV=development',
    'webpack serve --mode=development --open --config ./webpack/webpack.config.js',
].join(' ');
execSync(devScript, {stdio: 'inherit'});
