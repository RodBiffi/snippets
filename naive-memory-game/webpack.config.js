'use strict';

const Path = require('path');
const Webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const ExtractSASS = new ExtractTextPlugin('styles/bundle.[hash].css');
const port = 3001

module.exports = (options) => {
  const dest = Path.join(__dirname, 'dist');

  let webpackConfig = {
    devtool: 'cheap-eval-source-map',
    entry: [
      './src/scripts/index.js'
    ],
    output: {
      path: dest,
      filename: 'bundle.[hash].js'
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        minify: false
      })
    ],
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        }
      }]
    }
    };

  webpackConfig.plugins.push(
    new Webpack.HotModuleReplacementPlugin()
  );

  webpackConfig.module.rules.push({
    test: /\.s[ac]ss$/i,
    use: ['style-loader', 'css-loader', 'sass-loader']
  });

  webpackConfig.devServer = {
    contentBase: '/',
    hot: true,
    port,
    inline: true
  };

  return webpackConfig;
};
