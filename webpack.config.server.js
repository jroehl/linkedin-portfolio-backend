const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const GasPlugin = require('gas-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const { version, name } = require('./package.json');

const destination = 'dist';
const mode = 'production'; // or none

module.exports = {
  mode,
  context: __dirname,
  entry: './src/server/index.js',
  output: {
    filename: `${name}-${version}.js`,
    path: path.resolve(__dirname, destination),
    libraryTarget: 'this'
  },
  resolve: {
    extensions: ['.js']
  },
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          ie8: true,
          warnings: false,
          mangle: false,
          compress: {
            properties: false,
            warnings: false,
            drop_console: false
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
        test: /\src\/client\/\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          cache: true,
          failOnError: false
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: './appsscript.json',
        to: path.resolve(__dirname, destination)
      }
    ]),
    new GasPlugin({
      comments: false
    })
  ]
};
