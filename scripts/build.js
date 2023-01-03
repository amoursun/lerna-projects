const {execSync} = require('child_process');

console.time('build');
execSync('npx lerna run build --no-private --stream', {stdio: 'inherit'});
console.timeEnd('build');
