
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const config = {
  mode: 'development',
  entry: { test: path.resolve(__dirname, '../src/test') },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name][hash].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['react', 'es2015', 'stage-0']// 支持react jsx和ES6语法编译
        }
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]'
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1, modules: true }},
          'less-loader'
        ]
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
      format: '  构建 [:bar] :percent (:elapsed seconds)',
      clear: false,
      width: 60
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../assets'),
        to: path.resolve(__dirname, '/dist'),
        ignore: ['.*']
      }
    ])
  ],
  devServer: {
    port: 9000,
    open: true,
    inline: true, // 默认为true, 意思是，在打包时会注入一段代码到最后的js文件中，用来监视页面的改动而自动刷新页面,当为false时，网页自动刷新的模式是iframe，也就是将模板页放在一个frame中
    hot: false,
    compress: true,
  }
}
module.exports = config
