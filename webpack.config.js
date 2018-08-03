const path = require('path');

module.exports = {
    mode: "production",
    entry: "./src/index",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "index.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['react']//支持react jsx和ES6语法编译
                  }
            },
        ]
    }
}