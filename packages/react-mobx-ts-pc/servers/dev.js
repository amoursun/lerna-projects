require('./base')('development');
// const path = require('path');
const webpack = require('webpack');
const WebpackDevDevServer = require('webpack-dev-server');
const open = require('open');

const {
    p,
    mainEntry,
    port,
} = require('../config');

const webpackConfig = require('../webpack/webpack.config')({}, {mode: 'development'});

const compiler = webpack(webpackConfig);
// https://webpack.docschina.org/configuration/dev-server/#devserversetupmiddlewares
// https://www.npmjs.com/package/webpack-dev-server
const devServer = new WebpackDevDevServer({
    static: {
        publicPath: '/',
        directory: p.src,
    },
    // devMiddleware: {
    //     // 由于 Bundle Analyzer 太影响 liveReload 速度了，所以 dev 环境不进行 bundle analyze 了，所以 writeToDisk 也不需要了
    //     // for Webpack Bundle Analyzer
    //     // writeToDisk: true,
    // },
    // 自定义中间件
    setupMiddlewares: (middlewares, devServer) => {
        console.log(mainEntry);
        devServer.app.get('/', function (req, res) {
            res.redirect(`/${mainEntry}.html`);
        });

        return middlewares;
    },
    proxy: {
        '*': `http://localhost:${port.api}`,
    },
    historyApiFallback: true,
    port: port.dev,
}, compiler);

const localhost = `http://localhost:${port.dev}`;
compiler.hooks.done.tap('onDone', () => {
    // wait a tick for webpack output
    setTimeout(() => {
        console.info(`dev-server started at ${localhost}\n`);
    });
});

devServer.start();
open(`${localhost}/${mainEntry}.html`);
