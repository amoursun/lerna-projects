const {execSync} = require('child_process');

console.time('setup');

execSync('rm -rf ./node_modules', {stdio: 'inherit'});
execSync('npm install -d', {stdio: 'inherit'});
execSync('npx lerna run clean', {stdio: 'inherit'});
execSync('npm run ln-src-types', {stdio: 'inherit'});

console.timeEnd('setup');
