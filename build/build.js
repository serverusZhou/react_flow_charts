
const webpack = require('webpack')
const path = require('path')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

const config = {
  mode: 'production',
  entry: { index: path.resolve(__dirname, '../src/index') },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['react', 'es2015', 'stage-0']
        }
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
    new ProgressBarPlugin({
      format: '  已经构建 [:bar] :percent (:elapsed seconds)',
      clear: false,
      width: 60
    })
  ]
}
webpack(config, function (err, stats) {
  console.log(err)
})
