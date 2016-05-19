var webpack = require('webpack');
var helpers = require('./helpers');

/*
 * Webpack Plugins
 */
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {

  /*
   * Cache generated modules and chunks to improve performance for multiple
   * incremental builds.
   *
  * This is enabled by default in watch mode.
   * You can pass false to disable it.
   *
   * See: http://webpack.github.io/docs/configuration.html#cache
   * cache: false,
   *
   * The entry point for the bundle
   * Our Angular.js app
   *
   * See: http://webpack.github.io/docs/configuration.html#entry
   */
  entry: {
    'polyfills': './src/js/polyfills.js',
    'vendor'   : './src/js/vendor.js',
    'main'     : './src/js/main.js'
  },

  /*
   * Options affecting the resolving of modules.
   *
   * See: http://webpack.github.io/docs/configuration.html#resolve
   */
  resolve: {
    // Make sure root is src
    root: helpers.root('src'),

    // remove other default values
    modulesDirectories: ['node_modules'],
  },

  /*
   * Options affecting the normal modules.
   *
   * See: http://webpack.github.io/docs/configuration.html#module
   */
  module: {

    /*
     * An array of applied pre and post loaders.
     *
     * See: http://webpack.github.io/docs/configuration.html#module-preloaders-module-postloaders
     */
    preLoaders: [
      /*
       * Source map loader support for *.js files
       * Extracts SourceMaps for source files that as added as sourceMappingURL
       * comment.
       *
       * See: https://github.com/webpack/source-map-loader
       */
      {
        test: /\.js$/,
        loader: 'source-map-loader'
      },


      {
        test: /\.js$/,
        loaders: ['babel?presets[]=es2015'],
        exclude: /node_modules/
      },

      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css', 'sass')
      }
    ],

    /*
     * An array of automatically applied loaders.
     *
     * IMPORTANT: The loaders here are resolved relative to the resource which
     * they are applied to. This means they are not resolved relative to the
     * configuration file.
     *
     * See: http://webpack.github.io/docs/configuration.html#module-loaders
     */
    loaders: [
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        loader: 'babel'
      }
    ]
  },

  /*
   * Add additional plugins to the compiler.
   *
   * See: http://webpack.github.io/docs/configuration.html#plugins
   */
  plugins: [
    /*
     * Plugin: OccurenceOrderPlugin
     * Description: Varies the distribution of the ids to get the smallest id
     * length for often used ids.
     *
     * See:
     * https://webpack.github.io/docs/list-of-plugins.html#occurrenceorderplugin
     * See: https://github.com/webpack/docs/wiki/optimization#minimize
     */
    new webpack.optimize.OccurenceOrderPlugin(true),

    /*
     * Plugin: CommonsChunkPlugin
     * Description: Shares common code between the pages.
     * It identifies common modules and put them into a commons chunk.
     *
     * See:
     * https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
     * See: https://github.com/webpack/docs/wiki/optimization#multi-page-app
     */
    new webpack.optimize.CommonsChunkPlugin({
      name: helpers.reverse(['polyfills', 'vendor'])
    }),

    /*
     * Plugin: CopyWebpackPlugin
     * Description: Copy files and directories in webpack.
     *
     * Copies project static assets.
     *
     * See: https://www.npmjs.com/package/copy-webpack-plugin
     */
    new CopyWebpackPlugin([
      {
        from: 'src/index.html',
        to: 'index.html'
      },
    ]),


    /*
     * Plugin: HtmlWebpackPlugin
     * Description: Simplifies creation of HTML files to serve your webpack bundles.
     * This is especially useful for webpack bundles that include a hash in the filename
     * which changes every compilation.
     *
     * See: https://github.com/ampedandwired/html-webpack-plugin
     */
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      chunksSortMode: helpers.packageSort(['polyfills', 'vendor', 'main']),
      hash: true,
      inject: true
    }),

    /*
     * It moves every require("style.css") in entry chunks into a separate css
     * output file. So your styles are no longer inlined into the javascript,
     * but separate in a css bundle file (styles.css). If your total stylesheet
     * volume is big, it will be faster because the stylesheet bundle is loaded
     * in parallel to the javascript bundle.
     *
     * See: https://github.com/webpack/extract-text-webpack-plugin
     */
    new ExtractTextPlugin("[name].css")
  ]
};
