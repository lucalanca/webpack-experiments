var helpers = require('./helpers');
var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.common.js');


/**
 * Webpack Plugins
 */
var DedupePlugin = require('webpack/lib/optimize/DedupePlugin');
var UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
var CompressionPlugin = require('compression-webpack-plugin');
var WebpackMd5Hash = require('webpack-md5-hash');

module.exports = webpackMerge(commonConfig, {
  /**
   * Switch loaders to debug mode.
   *
   * See: http://webpack.github.io/docs/configuration.html#debug
   */
  debug: false,

  /**
   * Developer tool to enhance debugging
   *
   * See: http://webpack.github.io/docs/configuration.html#devtool
   * See: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
   */
  devtool: 'source-map',

  /**
   * Options affecting the output of the compilation.
   *
   * See: http://webpack.github.io/docs/configuration.html#output
   */
  output: {

    /**
     * The output directory as absolute path (required).
     *
     * See: http://webpack.github.io/docs/configuration.html#output-path
     */
    path: helpers.root('dist'),

    /**
     * Specifies the name of each output file on disk.
     * IMPORTANT: You must not specify an absolute path here!
     *
     * See: http://webpack.github.io/docs/configuration.html#output-filename
     */
    filename: '[name].[chunkhash].bundle.js',

    /**
     * The filename of the SourceMaps for the JavaScript files.
     * They are inside the output.path directory.
     *
     * See:
     * http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
     */
    sourceMapFilename: '[name].[chunkhash].bundle.map',

    /**
     * The filename of non-entry chunks as relative path
     * inside the output.path directory.
     *
     * See:
     * http://webpack.github.io/docs/configuration.html#output-chunkfilename
     */
    chunkFilename: '[id].[chunkhash].chunk.js'

  },

  /**
   * Add additional plugins to the compiler.
   *
   * See: http://webpack.github.io/docs/configuration.html#plugins
   */
  plugins: [

    /**
     * Plugin: WebpackMd5Hash
     * Description: Plugin to replace a standard webpack chunkhash with md5.
     *
     * See: https://www.npmjs.com/package/webpack-md5-hash
     */
    new WebpackMd5Hash(),

    /**
     * Plugin: DedupePlugin
     * Description: Prevents the inclusion of duplicate code into your bundle
     * and instead applies a copy of the function at runtime.
     *
     * See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
     * See: https://github.com/webpack/docs/wiki/optimization#deduplication
     */
    new DedupePlugin(),

    /**
     * Plugin: UglifyJsPlugin
     * Description: Minimize all JavaScript output of chunks.
     * Loaders are switched into minimizing mode.
     *
     * See: https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
     */
    // NOTE: To debug prod builds uncomment //debug lines and
    // comment //prod lines
    new UglifyJsPlugin({
      // beautify: true, //debug
      // mangle: false, //debug
      // dead_code: false, //debug
      // unused: false, //debug
      // deadCode: false, //debug
      // compress: {
      //   screw_ie8: true,
      //   keep_fnames: true,
      //   drop_debugger: false,
      //   dead_code: false,
      //   unused: false
      // }, // debug
      // comments: true, //debug

      beautify: false, //prod

      mangle: {
        'screw_ie8' : true,
        'keep_fnames': true
      }, //prod

      compress: {
        'screw_ie8': true
      }, //prod

      comments: false //prod
    }),

    /**
     * Plugin: CompressionPlugin
     * Description: Prepares compressed versions of assets to serve
     * them with Content-Encoding
     *
     * See: https://github.com/webpack/compression-webpack-plugin
     */
    new CompressionPlugin({
      regExp: /\.css$|\.html$|\.js$|\.map$/,
      threshold: 2 * 1024
    })

  ]

});
