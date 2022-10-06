const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const wasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");
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
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: 'css-loader',
            }, {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
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
        extensions: ['.ts', '.js', '.wasm', '.vue'],
        alias: {
            "@App": path.resolve(__dirname, 'src/'),
            'vue': 'vue/dist/vue.esm-bundler.js',
        }
    }
};