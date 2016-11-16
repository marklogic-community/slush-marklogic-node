/*jshint node: true */
module.exports = function(config) {
  config.set({
    // base path used to resolve all patterns
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'sinon', 'chai-sinon'],

    // list of files/patterns to load in the browser
    files: [{
      pattern: 'spec.bundle.js',
      watched: false
    }],

    // files to exclude
    exclude: [],

    plugins: [
      require('karma-chai'),
      require('karma-chrome-launcher'),
      require('karma-mocha'),
      require('karma-mocha-reporter'),
      require('karma-coverage'),
      require('karma-notify-reporter'),
      require('karma-sourcemap-loader'),
      require('karma-chai-sinon'),
      require('karma-sinon'),
      require('karma-webpack'),
      require('karma-phantomjs-launcher')
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'spec.bundle.js': ['webpack', 'sourcemap']
    },

    webpack: {
      devtool: 'inline-source-map',
      module: {
        /*\
        preLoaders: [{
          test: /\.js$/,
          loader: 'isparta'
        }],
        */
        loaders: [
          // transpile all files except modules and source files which are need be tested
          {
            test: /\.js$/,
            exclude: [/app((?!\.spec).)*$/, /node_modules/],
            loader: 'ng-annotate!babel'
          },
          // transpile and instrument only testable files with isparta
          // this allows us to generate a coverage report of all files
          {
            test: /\.js$/,
            include: [/app((?!\.spec).)*$/],
            loader: 'isparta'
          }, {
            test: /\.html$/,
            loader: 'html'
          }, {
            test: /\.styl$/,
            loader: 'style!css!stylus'
          }, {
            test: /\.less$/,
            loader: 'css!less'
          }, {
            test: /\.css$/,
            loader: 'style!css'
          }, {
            test: /\.(jpe?g|png|gif)$/i,
            loader: 'file'
          }, {
            test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'url-loader?limit=10000&mimetype=application/font-woff'
          }, {
            test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'file'
          }
        ]
      }
    },

    webpackServer: {
      noInfo: true // prevent console spamming when running in Karma!
    },

    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'coverage', 'notify'],

    coverageReporter: {
      // dir: report + 'coverage',
      reporters: [
        // reporters not supporting the `file` property
        {
          type: 'html',
          subdir: 'report-html'
        }, {
          type: 'lcov',
          subdir: 'report-lcov'
        }, {
          type: 'text-summary'
        } //, subdir: '.', file: 'text-summary.txt'}
      ]
    },
    // web server port
    port: 9876,

    // enable colors in the output
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // toggle whether to watch files and rerun tests upon incurring changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],

    // if true, Karma runs tests once and exits
    singleRun: false
  });
};
