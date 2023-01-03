// const fs = require('fs');
// const path = require('path');
const childProcess = require('child_process');
// const {p} = require('../config');

console.info('remove node_modules');
childProcess.execSync('rm -rf node_modules', {stdio: 'inherit'});

console.info('npm install -dd');
childProcess.execSync('npm install -dd', {stdio: 'inherit'});

console.info('dll dev');
childProcess.execSync('node scripts/dll --mode=development', {stdio: 'inherit'});

console.info('setup done, you may do \'npm run dev\'');
