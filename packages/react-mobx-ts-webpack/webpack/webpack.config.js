const path = require('path');
const webpack = require('webpack');
const dayjs = require('dayjs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const {
    p,
    port,
} = require('../config');

const postcssLoader = {
    loader: 'postcss-loader',
    options: {
        postcssOptions: {
            ident: 'postcss',
            plugins: [
                autoprefixer(),
                cssnano({
                    preset: 'default',
                }),
            ],
        },
    },
};

const lessLoader = {
    loader: 'less-loader',
    options: {
        lessOptions: {
            javascriptEnabled: true
        }
    },
};

const now = dayjs().format('YYYYMMDDHHmm');


module.exports = (env, argv = {}) => {
    const {mode = 'production'} = argv;
    const isDev = mode !== 'production';
    // eslint-disable-next-line import/no-dynamic-require
    const vendorManifest = isDev ? require(p.vendorManifestDev) : require(p.vendorManifest);
    const devtool = isDev ? 'eval-cheap-module-source-map' : 'cheap-module-source-map';

    const alias = {
        'src': p.src,
        'components': path.resolve(p.src, 'components'),
        'pages': path.resolve(p.src, 'pages'),
        'utils': path.resolve(p.src, 'utils'),
        'mobx': path.resolve(p.src, 'mobx'),
        'servers': path.resolve(p.src, 'servers'),
        'mock': p.mock
    };
    const entry = {};
    const entryName = 'index';

    const styleLoader = isDev ? 'style-loader' : MiniCssExtractPlugin.loader;

    entry[entryName] = [
        // for lazy code splitting
        // https://babeljs.io/docs/en/babel-plugin-syntax-dynamic-import#working-with-webpack-and-babel-preset-env
        'core-js/modules/es.promise',
        'core-js/modules/es.array.iterator',
        path.join(p.src, '/index.tsx'),
    ];
   
    return {
        mode,
        target: ['web', 'es5'],
        devtool,
        cache: {
            type: 'filesystem',
            cacheDirectory: path.resolve(__dirname, '.temp_cache'),
        },
        entry,
        output: {
            filename: isDev ? '[name].js' : '[name].[contenthash].js',
            chunkFilename: isDev ? '[name].js' : '[name].[contenthash].js',
            path: isDev ? p.distDev : p.distProd,
            publicPath: isDev ? '/' : './',
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js', '.jsx'],
            fallback: {
                'os': require.resolve('os-browserify/browser'),
            },
            alias,
        },
        optimization: {
            moduleIds: 'deterministic',
            runtimeChunk: 'single',
            splitChunks: {
                name: 'common',
                chunks: 'all',
            },

            // **DO NOT** set sideEffects as false which would make tree-shaking disabled
            // https://webpack.js.org/configuration/optimization/#optimizationsideeffects
            // sideEffects: true,

            // 需要调试 prod 代码时设为 false
            // 平时应常置为 undefined （即保持此行注释），webpack 根据 config.mode 自动选择是否需要压缩
            // minimize: false,

            minimizer: [
                new TerserPlugin({
                    parallel: true,
                    exclude: /\.min\.js$/,
                }),
                new CssMinimizerPlugin(),
            ],
        },
        module: {
            rules: [
                {
                    test: /\.[tj]sx?$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.css$/,
                    use: [
                        // 'style-loader',
                        styleLoader,
                        'css-loader',
                        postcssLoader,
                    ],
                },
                
                {
                    test: /\.less$/,
                    use: [
                        styleLoader,
                        'css-loader',
                        postcssLoader,
                        lessLoader,
                    ],
                },
                {
                    test: /\.(jpe?g|bmp|png|gif)$/,
                    loader: 'url-loader',
                    options: {
                        limit: 10240,
                    },
                },
                {
                    test: /\.(woff2?|ttf|svg|eot)$/,
                    loader: 'file-loader',
                },
                {
                    test: /\.(txt|md)$/i,
                    use: 'raw-loader',
                },
            ],
        },
        plugins: [
            new CaseSensitivePathsPlugin(),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(mode),
            }),
            new HtmlWebpackPlugin({
                chunks: ['index'],
                filename: `${entryName}.html`,
                template: path.resolve(p.public, 'index.html'),
                templateParameters: {
                    ENTRY_NAME: entryName,
                    BUILD_TIME: now,
                    SERVER_EXTRA: JSON.stringify({}),
                    SUPPORTED_BROWSER: JSON.stringify({
                        // e.g
                        //     ie: {
                        //         recommended: '11',
                        //         lowest: '10',
                        //     },
                    }),
                },
            }),
            // 太影响 liveReload 速度了，dev 就不分析了
            isDev ? null : new BundleAnalyzerPlugin({
                reportFilename: 'bundle-analyzer-report.html',
                analyzerMode: isDev ? 'server' : 'static',
                openAnalyzer: false,
            }),
            new webpack.DllReferencePlugin({
                // eslint-disable-next-line import/no-dynamic-require
                manifest: isDev ? require(p.vendorManifestDev) : require(p.vendorManifest),
            }),
            isDev ? null : new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: '[name].[contenthash].css',
                chunkFilename: '[name].[contenthash].css',
            }),
            new AddAssetHtmlPlugin([
                {
                    filepath: path.resolve(isDev ? p.dllDev : p.dllProd, `${vendorManifest.name}.js`),
                    includeSourcemap: true,
                    publicPath: isDev ? '/dll' : './dll',
                    outputPath: 'dll',
                },
            ]),
            new CopyPlugin({
                patterns: [
                    {
                        from: 'extras/**/*',
                        context: p.root,
                    },
                ],
            }),
        ].filter(Boolean),

        devServer: {
            static: {
                publicPath: '/',
                directory: p.src,
            },
            proxy: {
                '*': `http://localhost:${port}`,
            },
            hot: true,
            historyApiFallback: true,
            port: port,
            hot: true,
            compress: true,
        },
        watchOptions: {
            aggregateTimeout: 600
        },
        // externals 排除对应的包，注：排除掉的包必须要用script标签引入下
        externals: {
            // react: 'React',
            // 'react-dom': 'ReactDOM',
            // 'socket.io-client': 'io'
        }
    };
};
