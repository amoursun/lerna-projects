const path = require('path');
const fs = require('fs');
const p = {
    root: path.normalize(__dirname),
};
p.dist = path.resolve(p.root, 'dist');
p.src = path.resolve(p.root, 'src');
p.servers = path.resolve(p.root, 'servers');

p.distProd = path.join(p.dist, 'prod');
p.distDev = path.join(p.dist, 'dev');
p.dllDev = path.join(p.distDev, 'dll');
p.dllProd = path.join(p.distProd, 'dll');
p.vendorManifest = path.join(p.dllProd, 'manifest.json');
p.vendorManifestDev = path.join(p.dllDev, 'manifest.json');

p.entries = path.join(p.src, 'entries');
p.i18n = path.join(p.src, 'i18n');
p.i18nEnUs = path.join(p.i18n, 'en_us');
p.i18nZhCn = path.join(p.i18n, 'zh_cn');
p.bird = path.join(p.servers, 'bird');

function listDir(dir) {
    return fs.readdirSync(dir).filter(name => fs.statSync(path.join(dir, name)).isDirectory());
}

const entries = listDir(p.entries);

module.exports = {
    p,
    entries,

    // @todo 根据项目情况处置
    mainEntry: 'main',

    // @todo 根据项目情况处置
    port: {
        webpackDev: 3080,
        api: 3070,
        dev: 8020,
        prod: 8030,
        sentry: 7050,
        dashboard: 7099,
    },
    // 暂不能使用 [hash] 因为 `react-css-modules` 与 `css-loader` 生成的 hash 不一样
    // https://github.com/webpack-contrib/css-loader/issues/877
    // https://github.com/gajus/babel-plugin-react-css-modules/issues/279
    // localIdentName: '[local]__[hash:base64:5]',

    // 虽然不能使用 [hash:base64:5] 但由于我们的目的是使 [local] 圈定在唯一的 "scope" 中
    // 使用 [path] 获得等价的效果
    localIdentName: '[path]__[local]',
    // 但如果项目有使用 [hash] 的必要性，比如希望不暴露敏感的源码 [path] 信息
};
