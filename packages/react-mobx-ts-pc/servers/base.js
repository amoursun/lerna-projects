const {execSync} = require('child_process');
const fs = require('fs-extra');
const shell = require('shelljs');
const {p} = require('../config');

module.exports = (mode = 'production') => {
    shell.cd(p.root);
    if (mode === 'development' && !fs.existsSync(p.vendorManifestDev)) {
        execSync('npm run dll:dev', {stdio: 'inherit'});
    } else if (mode === 'production' && !fs.existsSync(p.distProd)) {
        execSync('npm run build', {stdio: 'inherit'});
    }
};
