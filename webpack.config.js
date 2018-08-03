const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: "production",
    entry: {index: "./src/index",test: "./src/test"},
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: '[name][hash].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['react', 'es2015']//支持react jsx和ES6语法编译
                  }
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: __dirname + '/dist/index.html',
            template: __dirname + '/index.html',
            inject: true,
            hash: false,
            chunks: ['test']
        })
    ]
}