
const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const WebpackDevServer = require('webpack-dev-server')

const config = {
  mode: 'production',
  entry: { test: path.resolve(__dirname, '../src/test') },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name][hash].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['react', 'es2015']// 支持react jsx和ES6语法编译
        }
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, '../dist/index.html'),
      template: path.resolve(__dirname, '../index.html'),
      inject: true,
      hash: false,
    }),
    new ProgressBarPlugin({
      format: '  build [:bar] :percent (:elapsed seconds)',
      clear: false,
      width: 60
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, '../dist'),
    port: 9000,
    open: true,
    index: path.resolve(__dirname, '../dist/index.html'), // 与HtmlWebpackPlugin中配置filename一样
    inline: true, // 默认为true, 意思是，在打包时会注入一段代码到最后的js文件中，用来监视页面的改动而自动刷新页面,当为false时，网页自动刷新的模式是iframe，也就是将模板页放在一个frame中
    hot: false,
    compress: true
  }
}
webpack(config, function (err, stats) {
  if (err) {
    console.error('打包出错了')
    return
  }
})