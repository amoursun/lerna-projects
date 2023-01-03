const {localIdentName} = require('./config');

module.exports = {
    presets: [
        ['@babel/preset-env', {
            targets: '> 1%, last 2 versions, ie 11',
            modules: false,
            corejs: '3',
            useBuiltIns: 'usage',
            // debug: true
        }],
        '@babel/preset-typescript',
        ['@babel/preset-react', {runtime: 'automatic'}],
    ],
    plugins: [
        // ['@babel/plugin-proposal-decorators', {'legacy': true}],
        '@babel/proposal-class-properties',

        // ** DO NOT ** use runtime plugin in project
        // - 项目中使用 babel polyfill (见 env options `core-js` and `useBuiltIns`
        //   而不使用 runtime 因为项目中所有库都是依赖 runtime 的，有些库需要 polyfill 才可以运行
        // - 我们会在 package.json 中维护一个“最适用” 版本，让使用 runtime 不同版本的包尽量不安装器 local 版本，
        //   以达到减少最终代码冗余的目的
        // - 而如果我们选择对一些库不使用其编译后的代码，而使用其源码进行编译，那编译策略自然跟随项目，用 polyfill 而不是 runtime
        // ['@babel/plugin-transform-runtime',
        //     corejs: 3,
        // }],
        '@babel/plugin-syntax-dynamic-import',

        // 临时方案，持续关注，见 https://github.com/babel/babel/issues/9872
        'babel-plugin-dynamic-import-polyfill',
        'babel-plugin-typescript-to-proptypes',
        ['react-css-modules', {
            'filetypes': {
                '.scss': {
                    'syntax': 'postcss-scss',
                    'plugins': [
                        'postcss-nested',
                    ],
                },
            },
            'generateScopedName': localIdentName,
            'handleMissingStyleName': 'warn',
        }],
    ],
};
