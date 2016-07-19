/*jshint node: true, strict: true*/

'use strict';

var args = require('yargs').argv;
var browserSync = require('browser-sync');
var config = require('./gulp.config')();
var del = require('del');
var fs = require('fs');
var glob = require('glob');
var gulp = require('gulp');
var path = require('path');
var username = require('username');

var webpack = require('webpack');
var webpackDevMiddelware = require('webpack-dev-middleware');
var webpachHotMiddelware = require('webpack-hot-middleware');
var colorsSupported = require('supports-color');
var historyApiFallback = require('connect-history-api-fallback');

/* jshint ignore:start */
var _ = require('lodash');
var $ = require('gulp-load-plugins')({
  lazy: true
});
/* jshint ignore:end */

/**
 * yargs variables can be passed in to alter the behavior, when present.
 * Example: gulp serve-dev
 *
 * --verbose  : Various tasks will produce more output to the console.
 * --nosync   : Don't launch the browser with browser-sync when serving code.
 * --debug  : Launch debugger with node-inspector.
 * --debug-brk: Launch debugger and break on 1st line with node-inspector.
 * --startServers: Will start servers for midway tests on the test task.
 * --ignoreErrors: Don't terminate build at vet or karma errors.
 */

/**
 * List the available gulp tasks
 */
gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

/**
 * vet the code and create coverage report
 * @return {Stream}
 */
gulp.task('vet', function() {
  log('Analyzing source with JSHint and JSCS');

  return gulp
    .src(config.alljs)
    .pipe($.if(args.verbose, $.print()))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish', {
      verbose: true
    }))
    .pipe($.if(!args.ignoreErrors, $.jshint.reporter('fail')))
    .pipe($.jscs())
    .pipe($.jscs.reporter())
    .pipe($.if(!args.ignoreErrors, $.jscs.reporter('fail')));
});

/**
 * Create a visualizer report
 * @param  {Function} done - callback when complete
 */
gulp.task('plato', function(done) {
  log('Analyzing source with Plato');
  log('Browse to /report/plato/index.html to see Plato results');

  startPlatoVisualizer(done);
});

var root = 'ui';
// helper method for resolving paths
var resolveToApp = function(glob) {
  return path.join(root, 'app', glob); // app/{glob}
};

var resolveToComponents = function(glob) {
  return path.join(root, 'app/components', glob); // app/components/{glob}
};

// map of all paths
var paths = {
  js: resolveToComponents('**/*!(.spec.js).js'), // exclude spec files
  html: [
    resolveToApp('**/*.html'),
    path.join(root, 'index.html')
  ],
  entry: [
    'babel-polyfill',
    path.join(__dirname, root, 'app/app.js')
  ],
  output: root,
  blankTemplates: path.join(__dirname, 'generator', 'component/**/*.**'),
  dest: path.join(__dirname, 'dist')
};


// use webpack.config.js to build modules
gulp.task('build', ['clean', 'test'], function(cb) {
  var config = require('./webpack/webpack.dist.config');
  config.entry.app = paths.entry;

  webpack(config, function(err, stats) {
    if (err) {
      throw new $.util.PluginError('webpack', err);
    }

    $.util.log('[webpack]', stats.toString({
      colors: colorsSupported,
      chunks: false,
      errorDetails: true
    }));

    cb();
  });
});


/**
 * Creates a sample local.json; can be used as model for dev.json and prod.json
 */
gulp.task('init-local', function() {
  //copy from slushfile - config gulp - with modifications to use config instead
  log('Creating local.json sample document with values drawn from gulp.config.js');
  try {
    var configJSON = {};
    configJSON['ml-version'] = config.marklogic.version;
    configJSON['ml-host'] = config.marklogic.host;
    configJSON['ml-admin-user'] = config.marklogic.username;
    configJSON['ml-admin-pass'] = config.marklogic.password;
    configJSON['ml-app-user'] = config.marklogic.username;
    configJSON['ml-app-pass'] = config.marklogic.password;
    configJSON['ml-http-port'] = config.marklogic.httpPort;
    configJSON['node-port'] = config.defaultPort;

    if (config.marklogic.version < 8) {
      configJSON['ml-xcc-port'] = config.marklogic.xccPort;
    }

    var configString = JSON.stringify(configJSON, null, 2) + '\n';
    fs.writeFileSync('local.json', configString, {
      encoding: 'utf8'
    });
  } catch (e) {
    log('failed to write local.json: ' + e.message);
  }
});

/**
 * Updates ecosystem.json
 */
gulp.task('add-deploy-target', function(done) {
  log('Update ecosystem.json targets or create new ones!');

  var ecosystem = 'ecosystem.json';

  if (!fs.existsSync(ecosystem)) {
    try {
      var configJSON = {};
      configJSON.deploy = {};

      var configString = JSON.stringify(configJSON, null, 2) + '\n';

      fs.writeFileSync('ecosystem.json', configString, {
        encoding: 'utf8'
      });
    } catch (e) {
      console.log('failed to write ecosystem.json: ' + e.message);
    }
  }

  var properties = fs.readFileSync('deploy/build.properties', {
    encoding: 'utf8'
  });

  var name = properties.match(/app-name=(.*)/)[1];
  var gitUrl = 'https://github.com/';
  var folderPath = '/space/projects/' + name;

  $.git.exec({
    args: 'config --get remote.origin.url',
    quiet: true
  }, function(err, stdout) {
    if (!err) {
      gitUrl = stdout.split('\n')[0];
    }

    var questions = [{
      type: 'input',
      name: 'targetName',
      message: 'What\'s the name of this deployment target? (If this target exists we\'ll replace it!!!!)',
      default: 'prod'
    }, {
      type: 'input',
      name: 'key',
      message: 'Where do you keep your ssh key that\'s used for both the target server and the git repository?',
      default: '~/.ssh/id_rsa'
    }, {
      type: 'input',
      name: 'username',
      message: 'Where\'s your username on the target server?',
      default: username.sync()
    }, {
      type: 'input',
      name: 'hostname',
      message: 'What\'s the hostname of the target server?',
      default: 'localhost'
    }, {
      type: 'input',
      name: 'branch',
      message: 'Which git branch are we deploying?',
      default: 'master'
    }, {
      type: 'input',
      name: 'gitUrl',
      message: 'What\'s the url of your git repository?',
      default: gitUrl
    }, {
      type: 'input',
      name: 'folder',
      message: 'Where do you want to store the project on your target server?',
      default: folderPath
    }];

    gulp.src(ecosystem)
      .pipe($.prompt.prompt(questions, function(answers) {

        gulp.src(ecosystem)
          .pipe($.jsonEditor(function(json) {
            json.deploy[answers.targetName] = {
              'key': answers.key,
              'user': answers.username,
              'host': [answers.hostname],
              'ref': 'origin/' + answers.branch,
              'repo': answers.gitUrl,
              'path': answers.folder,
              'post-deploy': 'npm install; bower install; gulp build'
            };
            return json; // must return JSON object.
          }))
          .pipe(gulp.dest('./'));
      }));
  });
});

/**
 * Remove all files from the build, temp, and reports folders
 * @return {Stream}
 */
gulp.task('clean', function(cb) {
  del([paths.dest]).then(function(paths) {
    $.util.log('[clean]', paths);
    cb();
  });
});


/**
 * Run specs once and exit
 * To start servers and run midway specs as well:
 *  gulp test --startServers
 * @param  {Function} done - callback when complete
 */
gulp.task('test', ['vet'], function(done) {
  startTests(true /*singleRun*/ , done);
});

/**
 * Run specs and wait.
 * Watch for file changes and re-run tests on each change
 * To start servers and run midway specs as well:
 *  gulp autotest --startServers
 * @param  {Function} done - callback when complete
 */
gulp.task('autotest', function(done) {
  startTests(false /*singleRun*/ , done);
});

/**
 * serve the local environment
 * --debug-brk or --debug
 * --nosync
 * @return {Stream}
 */
gulp.task('serve-local', function() {
  return serve('local' /*env*/ );
});

/**
 * serve the dev environment
 * --debug-brk or --debug
 * --nosync
 * @return {Stream}
 */
gulp.task('serve-dev', ['build'], function() {
  return serve('dev' /*env*/ );
});

/**
 * serve the prod environment
 * --debug-brk or --debug
 * --nosync
 * @return {Stream}
 */
gulp.task('serve-prod', ['build'], function() {
  return serve('prod' /*env*/ );
});

/**
 * Bump the version
 * --type=pre will bump the prerelease version *.*.*-x
 * --type=patch or no flag will bump the patch version *.*.x
 * --type=minor will bump the minor version *.x.*
 * --type=major will bump the major version x.*.*
 * --version=1.2.3 will bump to a specific version and ignore other flags
 * @return {Stream}
 */
gulp.task('bump', function() {
  var msg = 'Bumping versions';
  var type = args.type;
  var version = args.ver;
  var options = {};
  if (version) {
    options.version = version;
    msg += ' to ' + version;
  } else {
    options.type = type;
    msg += ' for a ' + type;
  }
  log(msg);

  return gulp
    .src(config.packages)
    .pipe($.print())
    .pipe($.bump(options))
    .pipe(gulp.dest(config.root))
    .pipe($.if(args.verbose, $.print()));
});

/**
 * serve the code
 * --debug-brk or --debug
 * --nosync
 * @param  {String} env - local | dev | prod
 * @param  {Boolean} specRunner - server spec runner html
 * @return {Stream}
 */
function serve(env, specRunner) {
  var debugMode = '--debug';
  var nodeOptions = getNodeOptions(env);

  nodeOptions.nodeArgs = (args.debug || args.debugBrk) ? [debugMode + '=5858'] : [];

  if (args.verbose) {
    log(nodeOptions);
  }

  return $.nodemon(nodeOptions)
    .on('restart', ['vet'], function(ev) {
      log('*** nodemon restarted');
      log('files changed:\n' + ev);
      setTimeout(function() {
        browserSync.notify('reloading now ...');
        browserSync.reload({
          stream: false
        });
      }, config.browserReloadDelay);
    })
    .on('start', function() {
      log('*** nodemon started');
      startBrowserSync(env, specRunner);
    })
    .on('crash', function() {
      log('*** nodemon crashed: script crashed for some reason');
    })
    .on('exit', function() {
      log('*** nodemon exited cleanly');
    });
}

/**
 * Determine whether the enviornment requires dev mode'
 * @param {String} env - local | dev | prod
 * @return {Boolean} - true if env==='local'
 */
function isDevMode(env) {
  return env === 'local';
}

function getNodeOptions(env) {
  var envJson;
  var envFile = './' + env + '.json';
  try {
    envJson = require(envFile);
  } catch (e) {
    envJson = {};
    log('Couldn\'t find ' + envFile + '; you can create this file to override properties - ' +
      '`gulp init-local` creates local.json which can be modified for other environments as well');
  }
  var port = args['app-port'] || process.env.PORT || envJson['node-port'] || config.defaultPort;
  return {
    script: config.nodeServer,
    delayTime: 1,
    env: {
      'PORT': port,
      'NODE_ENV': isDevMode(env) ? 'dev' : 'build',
      'APP_PORT': port,
      'ML_HOST': args['ml-host'] || process.env.ML_HOST || envJson['ml-host'] || config.marklogic.host,
      'ML_APP_USER': args['ml-app-user'] || process.env.ML_APP_USER || envJson['ml-app-user'] || config.marklogic.user,
      'ML_APP_PASS': args['ml-app-pass'] || process.env.ML_APP_PASS || envJson['ml-app-pass'] || config.marklogic.password,
      'ML_PORT': args['ml-http-port'] || process.env.ML_PORT || envJson['ml-http-port'] || config.marklogic.httpPort,
      'ML_XCC_PORT': args['ml-xcc-port'] || process.env.ML_XCC_PORT || envJson['ml-xcc-port'] || config.marklogic.xccPort,
      'ML_VERSION': args['ml-version'] || process.env.ML_VERSION || envJson['ml-version'] || config.marklogic.version
    },
    watch: [config.server]
  };
}

function startBrowserSync(env) {
  var config = require('./webpack/webpack.dev.config');
  config.entry.app = [
    // this modules required to make HRM working
    // it responsible for all this webpack magic
    'webpack-hot-middleware/client?reload=true',
    // application entry point
  ].concat(paths.entry);

  var compiler = webpack(config);

  var nodeOptions = getNodeOptions(env);

  if (args.nosync || browserSync.active) {
    return;
  }

  log('Starting BrowserSync on port ' + nodeOptions.env.APP_PORT);

  var options = {
    proxy: 'localhost:' + nodeOptions.env.APP_PORT,
    port: 3000,
    notify: true,
    reloadDelay: 0, //1000
    ui: false,
    open: true,
    /*server: {
      baseDir: root
    },*/
    middleware: isDevMode(env) ? [
      historyApiFallback(),
      webpackDevMiddelware(compiler, {
        stats: {
          colors: colorsSupported,
          chunks: false,
          modules: false
        },
        publicPath: config.output.publicPath
      }),
      webpachHotMiddelware(compiler)
    ] : [],
    ghostMode: { // these are the defaults t,f,t,t
      clicks: true,
      location: false,
      forms: true,
      scroll: true
    },
    injectChanges: true,
    logFileChanges: true,
    logLevel: 'debug',
    logPrefix: 'gulp-patterns'
  };

  browserSync(options);
}

/**
 * Start Plato inspector and visualizer
 * @param  {Function} done - callback when complete
 */
function startPlatoVisualizer(done) {
  log('Running Plato');

  var files = glob.sync(config.plato.js);
  var excludeFiles = /.*\.spec\.js/;
  var plato = require('plato');

  var options = {
    title: 'Plato Inspections Report',
    exclude: excludeFiles
  };
  var outputDir = config.report + '/plato';

  plato.inspect(files, outputDir, options, platoCompleted);

  function platoCompleted(report) {
    var overview = plato.getOverviewReport(report);
    if (args.verbose) {
      log(overview.summary);
    }
    if (done) {
      done();
    }
  }
}

/**
 * Start the tests using karma.
 * @param  {boolean} singleRun - True means run once and end (CI), or keep running (dev)
 * @param  {Function} done - Callback when complete
 */
function startTests(singleRun, done) {
  var child;
  var excludeFiles = [];
  var fork = require('child_process').fork;
  var Server = require('karma').Server;
  var serverSpecs = config.serverIntegrationSpecs;

  if (args.startServers) {
    log('Starting servers');
    var savedEnv = process.env;
    savedEnv.NODE_ENV = 'dev';
    savedEnv.PORT = 8888;
    child = fork(config.nodeServer);
  } else {
    if (serverSpecs && serverSpecs.length) {
      excludeFiles = serverSpecs;
    }
  }

  new Server({
    configFile: __dirname + '/karma.conf.js',
    exclude: excludeFiles,
    singleRun: !!singleRun
  }, karmaCompleted).start();
  ////////////////

  function karmaCompleted(karmaResult) {
    log('Karma completed');
    if (child) {
      log('shutting down the child process');
      child.kill();
    }
    if (karmaResult === 1) {
      if (!!args.ignoreErrors) {
        log($.util.colors.red('karma: tests failed with code ' + karmaResult));
        done();
      } else {
        done(new Error('karma: tests failed with code ' + karmaResult));
      }
    } else {
      done();
    }
  }
}

/**
 * Log a message or series of messages using chalk's blue color.
 * Can pass in a string, object or array.
 */
function log(msg) {
  if (typeof(msg) === 'object') {
    for (var item in msg) {
      if (msg.hasOwnProperty(item)) {
        $.util.log($.util.colors.blue(msg[item]));
      }
    }
  } else {
    $.util.log($.util.colors.blue(msg));
  }
}

module.exports = gulp;
