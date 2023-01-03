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
const CracoAntDesignPlugin = require('craco-antd');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const babelConfig = require('../babel.config');
const {
    p,
    entries,
    localIdentName,
} = require('../config');
const envConfig = require('./env-config');

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

const cssModuleLoader = {
    loader: 'css-loader',
    options: {
        sourceMap: true,
        modules: {
            localIdentName,
        },
    },
};

const sassLoader = {
    loader: 'sass-loader',
    options: {
        implementation: require('sass'),
        sourceMap: true,
    },
};

const now = dayjs().format('YYYYMMDDHHmm');


module.exports = (env, argv = {}) => {
    const {mode = 'production'} = argv;
    const isDev = mode !== 'production';
    // eslint-disable-next-line import/no-dynamic-require
    const vendorManifest = isDev ? require(p.vendorManifestDev) : require(p.vendorManifest);
    const {devtool = isDev ? 'eval-cheap-module-source-map' : 'cheap-module-source-map'} = envConfig;

    const alias = {
        'src': p.src,
        'common': path.join(p.src + 'common'),
    };
    const entry = {};
    const entryHtmlList = [];

    const styleLoader = isDev ? 'style-loader' : MiniCssExtractPlugin.loader;

    const setEntry = (entryList) => {
        entryList.forEach(entryName => {
            const entryPathName = entryName;
            // xxx ? `xxx-${entryName}` : entryName
            const templateEntryName = entryName;
            entry[entryName] = [
                // for lazy code splitting
                // https://babeljs.io/docs/en/babel-plugin-syntax-dynamic-import#working-with-webpack-and-babel-preset-env
                'core-js/modules/es.promise',
                'core-js/modules/es.array.iterator',
                path.join(p.entries, `${entryPathName}/index.tsx`),
            ];
            entryHtmlList.push(
                new HtmlWebpackPlugin({
                    chunks: [entryName],
                    filename: `${templateEntryName}.html`,
                    template: path.resolve(p.entries, 'index.html'),
                    templateParameters: {
                        ENTRY_NAME: templateEntryName,
                        BUILD_TIME: now,
                        SERVER_EXTRA: JSON.stringify({}),
                        SUPPORTED_BROWSER: JSON.stringify({
                            // e.g
                            //     ie: {
                            //         recommended: '11',
                            //         lowest: '10',
                            //     },
                        }),
                        ...envConfig,
                    },
                })
            );
        });
    };

    setEntry(entries);

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
                    use: [
                        {
                            loader: 'babel-loader',
                            options: babelConfig,
                        },
                    ],
                    exclude: /node_modules/,
                },
                {
                    test: /\.css$/,
                    exclude: /\.mod(ule)?\.css/,
                    use: [
                        // 'style-loader',
                        styleLoader,
                        'css-loader',
                        postcssLoader,
                    ],
                },
                {
                    test: /\.mod(ule)?\.css$/,
                    use: [
                        styleLoader,
                        cssModuleLoader,
                        postcssLoader,
                    ],
                },
                {
                    test: /\.s[ac]ss$/,
                    exclude: /\.mod(ule)?\.s[ac]ss/,
                    use: [
                        styleLoader,
                        'css-loader',
                        postcssLoader,
                        'resolve-url-loader',
                        sassLoader,
                    ],
                },
                {
                    test: /\.mod(ule)?\.s[ac]ss$/,
                    use: [
                        styleLoader,
                        cssModuleLoader,
                        postcssLoader,
                        'resolve-url-loader',
                        sassLoader,
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
            ...entryHtmlList,
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
            // https://github.com/DocSpring/craco-antd
            // {
            //     plugin: CracoAntDesignPlugin,
            //     options: {
            //       customizeTheme: {
            //         '@primary-color': '#1DA57A',
            //         "@link-color": "#1DA57A",
            //       },
            //     },
            // },
            new CopyPlugin({
                patterns: [
                    {
                        from: 'extras/**/*',
                        context: p.src,
                    },
                ],
            }),
        ].filter(Boolean),
    };
};
