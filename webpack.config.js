const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const wasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");
const { VueLoaderPlugin } = require('vue-loader')
const home = __dirname + '/src';
module.exports = {
    entry: {
        mooc: home + '/mooc.ts',
        start: home + '/start.ts',
        background: home + '/background.ts',
        popup: home + '/views/popup.ts'
    },
    output: {
        path: __dirname + '/build/cxmooc-tools/src',
        filename: '[name].js'
    },
    devtool: "source-map", // eval string is not permitted in manifest_v3 extensions
    plugins: [
        new htmlWebpackPlugin({
            filename: __dirname + '/build/cxmooc-tools/src/popup.html',
            template: home + '/views/popup.html',
            inject: 'head',
            title: '弹出页面',
            minify: {
                removeComments: true
            },
            chunks: ['popup']
        }),
        new wasmPackPlugin({
            crateDirectory: path.resolve(__dirname, "../chaoxing-rs/fxxkmod"),
            outDir: "../../cxmooc-tools/src/fxxkmod",
            extraArgs: "--target web",
        }),
        new webpack.DefinePlugin({
            global: 'window',		// Placeholder for global used in any node_modules
            __VUE_OPTIONS_API__: true, // (enable/disable Options API support, default: true)
            __VUE_PROD_DEVTOOLS__: false, // (enable/disable devtools support in production, default: false)
        }),
        new VueLoaderPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'css-loader',
                ],
            }, {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: { appendTsSuffixTo: [/\.vue$/] },
            }, {
                test: /\.vue$/,
                loader: 'vue-loader',
                // options: {
                //     hotReload: false
                // }
            }, {
                test: /\.wasm$/,
                type: "asset/inline",
            }
        ]
    },
    experiments: {
        syncWebAssembly: true
    },
    resolve: {
        extensions: ['.ts', '.js', '.wasm'],
        alias: {
            "@App": path.resolve(__dirname, 'src/'),
            'vue': 'vue/dist/vue.esm-bundler.js',
        }
    }
};