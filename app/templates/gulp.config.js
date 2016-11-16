/*jshint node: true */

'use strict';

module.exports = function() {
  var client = './ui/';
  var server = './node-server/';
  var clientApp = client + 'app/';
  var report = './report/';
  var root = './';
  var specRunnerFile = 'specs.html';
  var temp = './.tmp/';
  var _ = require('lodash');
  var wiredep = require('wiredep');

  var bower = {
    json: require('./bower.json'),
    directory: './bower_components/',
    ignorePath: '..'
  };

  var getWiredepDefaultOptions = function() {
    return {
      bowerJson: bower.json,
      directory: bower.directory,
      ignorePath: bower.ignorePath,
      exclude: ['requirejs', 'angularjs', 'font-awesome.css']
    };
  };
  var bowerFiles = wiredep(_.merge(getWiredepDefaultOptions(), {
    devDependencies: true
  })).js;
  var nodeModules = 'node_modules';

  var config = {
    marklogic: {
      version: 8,
      host: 'localhost',
      httpPort: '8040',
      xccPort: '8041',
      user: 'admin',
      password: 'admin'
    },
    /**
     * File paths
     */
    // all javascript that we want to vet
    alljs: [
      clientApp + '**/*.js'
    ],
    build: './dist/',
    client: client,
    css: temp + 'main.css',
    fonts: [
      bower.directory + 'font-awesome/fonts/**/*.*',
      bower.directory + 'bootstrap/fonts/**/*.*'
    ],
    tinymce: [
      bower.directory + 'tinymce-dist/**/*'
    ],
    html: client + '**/*.html',
    htmltemplates: clientApp + '**/*.html',
    images: client + 'images/**/*.*',
    staticdata: client + '**/*.json',
    index: client + 'index.html',
    // app js, with no specs
    js: [
      clientApp + '**/*.module.js',
      clientApp + '**/*.js',
      '!' + clientApp + '**/*.spec.js'
    ],
    jsOrder: [
      '**/app.module.js',
      '**/*.module.js',
      '**/*.js'
    ],
    less: client + 'styles/**/*.less',
    mainLess: client + 'styles/**/main.less',
    report: report,
    root: root,
    server: server,
    source: './ui/',
    stubsjs: [
      bower.directory + 'angular-mocks/angular-mocks.js',
      client + 'stubs/**/*.js'
    ],
    temp: temp,

    /**
     * optimized files
     */
    optimized: {
      app: 'app.js',
      lib: 'lib.js',
      ck: 'ck.js'
    },

    /**
     * plato
     */
    plato: {
      js: clientApp + '**/*.js'
    },

    /**
     * browser sync
     */
    browserReloadDelay: 1000,

    /**
     * template cache
     */
    templateCache: {
      file: 'templates.js',
      options: {
        module: 'app',
        root: 'app/'
      }
    },

    /**
     * Bower and NPM files
     */
    bower: bower,
    packages: [
      './package.json',
      './bower.json'
    ],

    /**
     * specs.html, our HTML spec runner
     */
    specRunner: client + specRunnerFile,
    specRunnerFile: specRunnerFile,

    /**
     * The sequence of the injections into specs.html:
     *  1 testlibraries
     *    mocha setup
     *  2 bower
     *  3 js
     *  4 spechelpers
     *  5 specs
     *  6 templates
     */
    testlibraries: [
      nodeModules + '/mocha/mocha.js',
      nodeModules + '/chai/chai.js',
      nodeModules + '/mocha-clean/index.js',
      nodeModules + '/sinon-chai/lib/sinon-chai.js'
    ],
    specHelpers: [client + 'test-helpers/*.js'],
    specs: [clientApp + '**/*.spec.js'],
    serverIntegrationSpecs: [client + '/tests/server-integration/**/*.spec.js'],

    /**
     * Node settings
     */
    nodeServer: './node-server/node-app.js',
    defaultPort: '9070'
  };

  /**
   * wiredep and bower settings
   */
  config.getWiredepDefaultOptions = getWiredepDefaultOptions;

  /**
   * karma settings
   */
  config.karma = getKarmaOptions();

  return config;

  ////////////////

  function getKarmaOptions() {
    var options = {
      files: [].concat(
        bowerFiles,
        config.specHelpers,
        clientApp + '**/*.module.js',
        clientApp + '**/*.js',
        temp + config.templateCache.file,
        config.serverIntegrationSpecs
      ),
      exclude: [],
      coverage: {
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
      preprocessors: {}
    };
    options.preprocessors[clientApp + '**/!(*.spec)+(.js)'] = ['coverage'];
    return options;
  }
};
