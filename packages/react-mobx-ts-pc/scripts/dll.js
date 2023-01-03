const {execSync} = require('child_process');
const fs = require('fs-extra');
const shell = require('shelljs');
const {program} = require('commander');

const {p} = require('../config');

function runDll(mode) {
    mode = mode || 'production';

    shell.cd(p.root);
    fs.ensureDirSync(p.dist);

    if (mode === 'development') {
        shell.rm('-rf', p.dllDev);
    }
    execSync(`npx webpack --mode=${mode} --config webpack/dll.webpack.config.js`, {stdio: 'inherit'});
}

program
    .option('-m,--mode <mode>', 'mode')
    .action((options) => {
        runDll(options.mode);
    })
    .parse(process.argv);
