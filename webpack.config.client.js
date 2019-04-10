const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const destination = 'dist';
const mode = 'production'; // or none

module.exports = {
  mode,
  context: __dirname,
  entry: {
    webhooks: './src/client/webhooks/index.js',
    setup: './src/client/setup/index.js'
  },
  output: {
    filename: `temp-[name].js`,
    path: path.resolve(__dirname, destination)
  },
  resolve: {
    extensions: ['.js']
  },
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          warnings: true,
          mangle: false,
          keep_fnames: true,
          compress: {
            unused: false,
            warnings: false,
            drop_console: false,
            keep_fnames: true
          },
          output: {
            beautify: true
          }
        }
      })
    ]
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          cache: false,
          failOnError: false
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      protectWebpackAssets: false,
      cleanOnceBeforeBuildPatterns: [],
      cleanAfterEveryBuildPatterns: ['**/temp-*']
    }),
    new HtmlWebpackPlugin({
      inject: true,
      inlineSource: '.(js|css)$',
      chunks: ['webhooks'],
      template: './src/client/webhooks/index.html',
      filename: 'webhooks.html'
    }),
    new HtmlWebpackPlugin({
      inject: true,
      inlineSource: '.(js|css)$',
      chunks: ['setup'],
      template: './src/client/setup/index.html',
      filename: 'setup.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'temp-[name].css'
    }),
    new HtmlWebpackInlineSourcePlugin()
  ]
};
