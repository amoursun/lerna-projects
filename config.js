const path = require('path');
const fs = require('fs');
const root = path.resolve(__dirname);
const pathPackages = path.join(root, 'packages');

const p = {
    root,
    packages: pathPackages,
    scripts: path.join(root, 'scripts'),
};

function listDir(dir) {
    return fs.readdirSync(dir).filter(
        name => fs.statSync(path.join(dir, name)).isDirectory(),
    );
}

module.exports = {
    p,
    packagesList: listDir(pathPackages),
    port: {
        dev: 6088,
        prod: 6080,
        coverage: 6090,
    },
};
