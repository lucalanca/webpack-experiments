'use strict';

const path = require('path');
const webpack = require('webpack');

/*
 * Webpack Plugins
 */
const OccurenceOrderPlugin = webpack.optimize.OccurenceOrderPlugin;
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const DedupePlugin = require('webpack/lib/optimize/DedupePlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const CompressionPlugin = require('compression-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');


/* Postcss Plugins */
const autoprefixer = require('autoprefixer')({ browsers: ['last 2 versions'] });
const cssnano = require('cssnano')({ safe: true });

const SKELETON_ENV = process.env.SKELETON_ENV || 'development';
let DEVTOOL;
let DEBUG;
let OUTPUT;
let ADDITIONAL_PLUGINS;

console.log(`SKELETON_ENV=${SKELETON_ENV}`);

switch (SKELETON_ENV) {
  case 'prod':
  case 'production':
    DEVTOOL = 'source-map';
    DEBUG = false;
    OUTPUT = {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[chunkhash].bundle.js',
      sourceMapFilename: '[name].[chunkhash].bundle.map',
      chunkFilename: '[id].[chunkhash].chunk.js',
    };
    ADDITIONAL_PLUGINS = [
      new WebpackMd5Hash(),
      new DedupePlugin(),
      new UglifyJsPlugin({
        beautify: false,
        mangle: {
          screw_ie8: true,
          keep_fnames: true,
        },
        compress: {
          screw_ie8: true,
        },
        comments: false,
      }),
      new CompressionPlugin({
        regExp: /\.css$|\.html$|\.js$|\.map$/,
        threshold: 2 * 1024,
      }),
      new OccurenceOrderPlugin(true),
      new CommonsChunkPlugin({
        name: ['vendor'],
        minChunks: Infinity,
      }),
    ];
    break;
  case 'test':
  case 'testing':
    DEVTOOL = 'inline-source-map';
    DEBUG = false;
    OUTPUT = {};
    ADDITIONAL_PLUGINS = [];
    break;
  case 'dev':
  case 'development':
  default:
    DEVTOOL = 'cheap-module-source-map';
    DEBUG = true;
    OUTPUT = {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].bundle.js',
      sourceMapFilename: '[name].map',
      chunkFilename: '[id].chunk.js',
    };
    ADDITIONAL_PLUGINS = [];
}

module.exports = {
  entry: {
    polyfills: './src/js/polyfills.js',
    vendor: './src/js/vendor.js',
    main: './src/js/main.js',
  },

  resolve: {
    root: path.resolve(__dirname, 'src'),
    modulesDirectories: ['node_modules'],
  },

  debug: DEBUG,
  devtool: DEVTOOL,
  output: OUTPUT,

  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'source-map-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(scss|sass)$/,
        loader: 'stylelint',
      },
      {
        test: /\.js$/,
        loader: 'eslint',
        exclude: /node_modules/,
      },
    ],

    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel?presets[]=es2015'],
        exclude: /node_modules/,
      },
      {
        test: /\.(scss|sass)$/,
        loader: ExtractTextPlugin.extract(['css', 'postcss', 'sass', 'stylelint']),
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      hash: true,
      inject: true,
      chunks: ['polyfills', 'vendor', 'main'],
    }),
    new ExtractTextPlugin('[name].css'),
  ].concat(ADDITIONAL_PLUGINS),
  postcss() { return [autoprefixer, cssnano]; },
};
