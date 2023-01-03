const path = require('path');
const fs = require('fs');
const p = {
    root: path.normalize(__dirname),
};
p.dist = path.resolve(p.root, 'dist');
p.src = path.resolve(p.root, 'src');
p.mock = path.resolve(p.root, 'mock');
p.extras = path.resolve(p.root, 'extras');
p.public = path.resolve(p.root, 'public');

p.distProd = path.join(p.dist, 'prod');
p.distDev = path.join(p.dist, 'dev');
p.dllDev = path.join(p.distDev, 'dll');
p.dllProd = path.join(p.distProd, 'dll');
p.vendorManifest = path.join(p.dllProd, 'manifest.json');
p.vendorManifestDev = path.join(p.dllDev, 'manifest.json');

module.exports = {
    p,
    port: 8866,
};
