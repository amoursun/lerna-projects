// const fs = require('fs');
// const path = require('path');
const childProcess = require('child_process');
// const {p} = require('../config');

console.info('remove node_modules');
childProcess.execSync('rm -rf node_modules', {stdio: 'inherit'});

console.info('npm install -dd');
childProcess.execSync('npm install -dd', {stdio: 'inherit'});

childProcess.execSync('vite', {stdio: 'inherit'});
