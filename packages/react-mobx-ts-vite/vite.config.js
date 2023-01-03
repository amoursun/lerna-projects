import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import vitePluginImp from 'vite-plugin-imp';
import vitePluginEslint from 'vite-plugin-eslint';
import { chunkSplitPlugin } from 'vite-plugin-chunk-split';

const path = require('path');

export default defineConfig({
    resolve: {
        alias: {
            src: path.resolve(__dirname, 'src'),
            components: path.resolve(__dirname, 'src/components'),
            pages: path.resolve(__dirname, 'src/pages'),
            utils: path.resolve(__dirname, 'src/utils'),
            '@mobx': path.resolve(__dirname, 'src/mobx'),
            servers: path.resolve(__dirname, 'src/servers'),
            mock: path.resolve(__dirname, 'mock')
        }
    },
    // 依赖优化
    // 预构建, 默认node_modules 加入
    // https://cn.vitejs.dev/config/dep-optimization-options.html#optimizedeps-entries
    optimizeDeps: {
        // 排除预构建包
        // exclude: ['react', 'react-dom', 'lodash-es'],
        // include: ['react', 'react-dom', 'lodash'],
    },
    build: {
        // 指定输出路径（相对于 项目根目录)
        outDir: 'dist',
        // 生成静态资源的存放路径（相对于 outDir)
        assetsDir: 'js', // 默认 assets
        manifest: true,
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html')
                // 多应用
                // other: path.resolve(__dirname, 'other/index.html),
            }
        }
    },
    plugins: [
        vitePluginEslint(), // 运行时候提醒eslint
        reactRefresh(),
        chunkSplitPlugin({
            strategy: 'default',
            customSplitting: {
                // `react` and `react-dom` 会被打包到一个名为`render-vendor`的 chunk 里面
                // (包括它们的一些依赖，如 object-assign)
                'react-vendor': ['react', 'react-dom'],
                // 源码中 utils 目录的代码都会打包进 `utils` 这个 chunk 中
                utils: [/src\/utils/]
            }
        }),
        vitePluginImp({
            libList: [
                {
                    libName: 'antd',
                    libDirectory: 'es',
                    style: name => `antd/es/${name}/style`
                }
            ]
        })
    ],
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true
            }
        }
    }
});
