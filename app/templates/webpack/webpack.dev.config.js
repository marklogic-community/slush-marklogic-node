var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  output: {
    filename: '[name].bundle.js',
    publicPath: 'http://localhost:3000/',
    path: path.resolve(__dirname, 'ui')
  },
  devtool: 'cheap-module-eval-source-map',
  entry: {},
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: [/app\/lib/, /node_modules/],
      loader: 'ng-annotate!babel'
    }, {
      test: /\.html$/,
      loader: 'html'
    }, {
      test: /\.styl$/,
      loader: 'style!css!stylus'
    }, {
      test: /\.less$/,
      loader: 'style!css?sourceMap!less?sourceMap'
    }, {
      test: /\.css$/,
      loader: 'style!css'
    }, {
      test: /\.(gif|png|jpe?g|svg|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
      loaders: [
        'file?hash=sha512&digest=hex&name=[hash].[ext]'
      ]
    }, {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'url-loader?limit=10000&mimetype=application/font-woff'
    }, {
      test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'file'
    }]
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    // Injects bundles in your index.html instead of wiring all manually.
    // It also adds hash to all injected assets so we don't have problems
    // with cache purging during deployment.
    new HtmlWebpackPlugin({
      template: 'ui/index.html',
      inject: 'body',
      favicon: 'ui/images/favicon.ico',
      hash: true
    }),

    // Automatically move all modules defined outside of application directory to vendor bundle.
    // If you are using more complicated project structure, consider to specify common chunks manually.
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function(module, count) {
        return module.resource && module.resource.indexOf(path.resolve(__dirname, 'ui')) === -1;
      }
    }),
    // Adds webpack HMR support. It act's like livereload,
    // reloading page after webpack rebuilt modules.
    // It also updates stylesheets and inline assets without page reloading.
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
};
