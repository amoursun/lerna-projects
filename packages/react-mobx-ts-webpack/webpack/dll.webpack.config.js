const webpack = require('webpack');
// const path = require('path')

const {p} = require('../config');

// dont't use [name].[fullhash] | [name]-[fullhash]
// they would cause `SyntaxError: Invalid or unexpected token` while doing dll reference
const vendorName = '[name]_[fullhash]';

module.exports = (env, argv = {}) => {
    const {mode = 'production'} = argv;
    const isDev = mode !== 'production';
    const outputPath = isDev ? p.dllDev : p.dllProd;
    const manifestPath = isDev ? p.vendorManifestDev : p.vendorManifest;
    return {
        mode,
        target: ['web', 'es5'],
        entry: {
            vendor: [
                'react',
                'react-dom',
            ],
        },
        output: {
            // same as dllPlugin `name`
            // so that AddAssetHtmlPlugin can use `${vendorManifest.name}.js` to as filepath
            filename: `${vendorName}.js`,
            path: outputPath,
            publicPath: isDev ? '/' : './',
            library: vendorName,
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(mode),
            }),
            new webpack.DllPlugin({
                name: vendorName,
                path: manifestPath,
            }),
        ],
    };

};
