
const webpack = require('webpack')
const path = require('path')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const nodeExternals = require('webpack-node-externals')

const config = {
  mode: 'production',
  entry: { index: path.resolve(__dirname, '../src/index') },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs2'
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
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=819200&name=images/[hash:8].[name].[ext]'
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1, modules: true }},
          'less-loader'
        ]
      },
      {
        test: /\.svg/,
        loader: 'svg-url-loader?limit=8192&name=images/[hash:8].[name].[ext]'
      }
    ]
  },
  externals: [nodeExternals(), 'React'],
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
