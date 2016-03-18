/*jshint node: true */

'use strict';

var args = require('yargs').argv;
var browserSync = require('browser-sync');
var config = require('./gulp.config')();
var del = require('del');
var fs = require('fs');
var glob = require('glob');
var gulp = require('gulp');
var path = require('path');

/* jshint ignore:start */
var _ = require('lodash');
var $ = require('gulp-load-plugins')({lazy: true});
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
    .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
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

/**
 * Compile less to css
 * @return {Stream}
 */
gulp.task('styles', ['clean-styles'], function() {
  log('Compiling Less --> CSS');

  var less = $.less().on('error',function(e){
    $.util.log($.util.colors.red(e));
    this.emit('end', e);
  });

  return gulp
    .src(config.less)
    .pipe($.plumber()) // exit gracefully if something fails after this
    .pipe(less)
    .pipe($.autoprefixer({browsers: ['last 2 version', '> 5%']}))
    .pipe(gulp.dest(config.temp))
    .pipe($.if(args.verbose, $.print()));
});

/**
 * Copy fonts
 * @return {Stream}
 */
gulp.task('fonts', ['clean-fonts'], function() {
  log('Copying fonts');

  return gulp
    .src(config.fonts)
    .pipe(gulp.dest(config.client + 'fonts'))
    .pipe($.if(args.verbose, $.print()))
    .pipe(gulp.dest(config.build + 'fonts'))
    .pipe($.if(args.verbose, $.print()));
});

/**
- * Copy static data like lang.json
- * @return {Stream}
- */
gulp.task('statics', function() {
  log('Copying statics');

  return gulp
    .src(config.staticdata)
    .pipe(gulp.dest(config.build))
    .pipe($.if(args.verbose, $.print()));
});

/**
 * Copy tinymce files
 * @return {Stream}
 */
gulp.task('tinymce', function() {
  log('Copying tinymce files');

  return gulp
    .src(config.tinymce, { base: './bower_components/tinymce-dist' })
    .pipe(gulp.dest(config.build + 'js/'))
    .pipe($.if(args.verbose, $.print()));
});

/**
 * Compress images
 * @return {Stream}
 */
gulp.task('images', ['clean-images'], function() {
  log('Compressing and copying images');

  return gulp
    .src(config.images)
    .pipe($.imagemin({optimizationLevel: 4}))
    .pipe(gulp.dest(config.build + 'images'))
    .pipe($.if(args.verbose, $.print()));
});

/**
 * Watch for less file changes
 * @return {Stream}
 */
gulp.task('less-watcher', function() {
  return gulp.watch([config.less], ['styles']);
});

/**
 * Create $templateCache from the html templates
 * @return {Stream}
 */
gulp.task('templatecache', ['clean-code'], function() {
  log('Creating an AngularJS $templateCache');

  return gulp
    .src(config.htmltemplates)
    .pipe($.if(args.verbose, $.bytediff.start()))
    .pipe($.htmlmin())
    .pipe($.if(args.verbose, $.bytediff.stop(bytediffFormatter)))
    .pipe($.angularTemplatecache(
      config.templateCache.file,
      config.templateCache.options
    ))
    .pipe(gulp.dest(config.temp))
    .pipe($.if(args.verbose, $.print()));
});

/**
 * Wire-up the bower dependencies
 * @return {Stream}
 */
gulp.task('wiredep', function() {
  log('Wiring the bower dependencies into the html');

  var wiredep = require('wiredep').stream;
  var options = config.getWiredepDefaultOptions();

  // Only include stubs if flag is enabled
  var js = args.stubs ? [].concat(config.js, config.stubsjs) : config.js;

  return gulp
    .src(config.index)
    .pipe(wiredep(options))
    .pipe(inject(js, '', config.jsOrder))
    .pipe(gulp.dest(config.client))
    .pipe($.if(args.verbose, $.print()));
});

/**
 * Inject dependencies into index.html
 * @return {Stream}
 */
gulp.task('inject', ['wiredep', 'styles', 'templatecache'], function() {
  log('Wire up css into the html, after files are ready');

  return gulp
    .src(config.index)
    .pipe(inject(config.css))
    .pipe(gulp.dest(config.client))
    .pipe($.if(args.verbose, $.print()));
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
    fs.writeFileSync('local.json', configString, { encoding: 'utf8' });
  } catch (e) {
    log('failed to write local.json: ' + e.message);
  }
});

/**
 * Run the spec runner
 * @param  {Function} done - callback when complete
 */
gulp.task('serve-specs', ['build-specs'], function(done) {
  log('run the spec runner');
  serve('local' /* env */, true /* specRunner */);
  done();
});

/**
 * Inject all the spec files into the specs.html
 * @return {Stream}
 */
gulp.task('build-specs', ['templatecache'], function() {
  log('building the spec runner');

  var wiredep = require('wiredep').stream;
  var templateCache = config.temp + config.templateCache.file;
  var options = config.getWiredepDefaultOptions();
  var specs = config.specs;

  if (args.startServers) {
    specs = [].concat(specs, config.serverIntegrationSpecs);
  }
  options.devDependencies = true;

  return gulp
    .src(config.specRunner)
    .pipe(wiredep(options))
    .pipe(inject(config.js, '', config.jsOrder))
    .pipe(inject(config.testlibraries, 'testlibraries'))
    .pipe(inject(config.specHelpers, 'spechelpers'))
    .pipe(inject(specs, 'specs', ['**/*']))
    .pipe(inject(templateCache, 'templates'))
    .pipe(gulp.dest(config.client))
    .pipe($.if(args.verbose, $.print()));
});

/**
 * Build everything
 * This is separate so we can run tests on
 * optimize before handling image or fonts
 * @param  {Function} done - callback when complete
 */
gulp.task('build', ['optimize', 'images', 'fonts', 'statics', 'tinymce'], function(done) {
  log('Building everything');

  var msg = {
    title: 'gulp build',
    subtitle: 'Deployed to the build folder',
    message: 'Running `gulp serve-dist`'
  };
  log(msg);
  notify(msg);
  done();
});

/**
 * Optimize all files, move to a build folder,
 * and inject them into the new index.html
 * @return {Stream}
 */
gulp.task('optimize', ['inject', 'test'], function() {
  log('Optimizing the js, css, and html');

  // Filters are named for the gulp-useref path
  var cssFilter = $.filter('**/*.css', {restore: true});
  var jsAppFilter = $.filter('**/' + config.optimized.app, {restore: true});
  var jslibFilter = $.filter('**/' + config.optimized.lib, {restore: true});

  var templateCache = config.temp + config.templateCache.file;

  var combined = gulp
    .src(config.index)
    .pipe($.plumber())
    .pipe(inject(templateCache, 'templates'))

    // Apply the concat and file replacement with useref
    .pipe($.useref({searchPath: './'}))

    // Get the css
    .pipe(cssFilter)
    // Take inventory of the css file names for future rev numbers
    .pipe($.rev())
    .pipe($.sourcemaps.init())
    .pipe($.cssnano({safe: true}))
    // write sourcemap for css
    .pipe($.sourcemaps.write('.'))
    .pipe(cssFilter.restore)

    // Get the custom javascript
    .pipe(jsAppFilter)
    // Take inventory of the js app file name for future rev numbers
    .pipe($.rev())
    .pipe($.sourcemaps.init())
    .pipe($.ngAnnotate({add: true}))
    .pipe($.uglify())
    // write sourcemap for js app
    .pipe($.sourcemaps.write('.'))
    .pipe(jsAppFilter.restore)

    // Get the vendor javascript
    .pipe(jslibFilter)
    // Take inventory of the js lib file name for future rev numbers
    .pipe($.rev())
    .pipe($.sourcemaps.init())
    .pipe($.uglify()) // another option is to override wiredep to use min files
    // write sourcemap for js lib
    .pipe($.sourcemaps.write('.'))
    .pipe(jslibFilter.restore)

    // Rename the recorded file names in the steam, and in the html to append rev numbers
    .pipe($.revReplace())

    // copy result to dist/, and print some logging..
    .pipe(gulp.dest(config.build))
    .pipe($.if(args.verbose, $.print()));

  combined.on('error', console.error.bind(console));

  return combined;
});

/**
 * Remove all files from the build, temp, and reports folders
 * @return {Stream}
 */
gulp.task('clean', ['clean-fonts'], function() {
  var files = [].concat(config.build, config.temp, config.report);
  return clean(files);
});

/**
 * Remove all fonts from the build folder
 * @return {Stream}
 */
gulp.task('clean-fonts', function() {
  var files = [].concat(
    config.build + 'fonts/**/*.*',
    config.client + 'fonts/**/*.*'
  );
  return clean(files);
});

/**
 * Remove all images from the build folder
 * @return {Stream}
 */
gulp.task('clean-images', function() {
  return clean(config.build + 'images/**/*.*');
});

/**
 * Remove all styles from the build and temp folders
 * @return {Stream}
 */
gulp.task('clean-styles', function() {
  var files = [].concat(
    config.temp + '**/*.css',
    config.build + 'styles/**/*.css',
    config.build + 'styles/**/*.css.map'
  );
  return clean(files);
});

/**
 * Remove all js and html from the build and temp folders
 * @return {Stream}
 */
gulp.task('clean-code', function() {
  var files = [].concat(
    config.temp + '**/*.js',
    config.build + 'js/**/*.js',
    config.build + 'js/**/*.js.map',
    config.build + '**/*.html'
  );
  return clean(files);
});

/**
 * Run specs once and exit
 * To start servers and run midway specs as well:
 *  gulp test --startServers
 * @param  {Function} done - callback when complete
 */
gulp.task('test', ['vet', 'templatecache'], function(done) {
  startTests(true /*singleRun*/, done);
});

/**
 * Run specs and wait.
 * Watch for file changes and re-run tests on each change
 * To start servers and run midway specs as well:
 *  gulp autotest --startServers
 * @param  {Function} done - callback when complete
 */
gulp.task('autotest', function(done) {
  startTests(false /*singleRun*/, done);
});

/**
 * serve the local environment
 * --debug-brk or --debug
 * --nosync
 * @return {Stream}
 */
gulp.task('serve-local', ['inject', 'fonts'], function() {
  return serve('local' /*env*/);
});

/**
 * serve the dev environment
 * --debug-brk or --debug
 * --nosync
 * @return {Stream}
 */
gulp.task('serve-dev', ['build'], function() {
  return serve('dev' /*env*/);
});

/**
 * serve the prod environment
 * --debug-brk or --debug
 * --nosync
 * @return {Stream}
 */
gulp.task('serve-prod', ['build'], function() {
  return serve('prod' /*env*/);
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
 * When files change, log it
 * @param  {Object} event - event that fired
 */
function changeEvent(event) {
  var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
  log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
}

/**
 * Delete all files in a given path
 * @param  {Array}   files - array of paths to delete
 * @return {Stream}
 */
function clean(files) {
  log('Cleaning: ' + $.util.colors.blue(files));
  return del(files)
    .then(function(paths) {
      if (args.verbose) {
        log(paths.map(function(path) {
          return path.replace(__dirname + '/', 'rm ');
        }));
      }
    });
}

/**
 * Inject files in a sorted sequence at a specified inject label
 * @param   {Array} src   glob pattern for source files
 * @param   {String} label   The label name
 * @param   {Array} order   glob pattern for sort order of the files
 * @return  {Stream}
 */
function inject(src, label, order) {
  var options = {read: false};
  if (label) {
    options.name = 'inject:' + label;
  }

  return $.inject(orderSrc(src, order), options);
}

/**
 * Order a stream
 * @param   {Stream} src   The gulp.src stream
 * @param   {Array} order Glob array pattern
 * @return  {Stream} The ordered stream
 */
function orderSrc (src, order) {
  return gulp
    .src(src)
    .pipe($.if(order, $.order(order)));
}

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
        browserSync.reload({stream: false});
      }, config.browserReloadDelay);
    })
    .on('start', function () {
      log('*** nodemon started');
      startBrowserSync(env, specRunner);
    })
    .on('crash', function () {
      log('*** nodemon crashed: script crashed for some reason');
    })
    .on('exit', function () {
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
  }
  catch (e) {
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

/**
 * Start BrowserSync
 * --nosync will avoid browserSync
 */
function startBrowserSync(env, specRunner) {
  var nodeOptions = getNodeOptions(env);

  if (args.nosync || browserSync.active) {
    return;
  }

  log('Starting BrowserSync on port ' + nodeOptions.env.APP_PORT);

  // If build: watches the files, builds, and restarts browser-sync.
  // If dev: watches less, compiles it to css, browser-sync handles reload
  if (isDevMode(env)) {
    gulp.watch([config.less], ['styles'])
      .on('change', changeEvent);
  }
  else {
    gulp.watch([config.less, config.js, config.html], ['optimize', browserSync.reload])
      .on('change', changeEvent);
  }

  var options = {
    proxy: 'localhost:' + nodeOptions.env.APP_PORT,
    port: 3000,
    files: isDevMode(env) ? [
      config.client + '**/*.*',
      '!' + config.less,
      config.temp + '**/*.css'
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
    logPrefix: 'gulp-patterns',
    notify: true,
    reloadDelay: 0, //1000
    ui: false
  } ;
  if (specRunner) {
    options.startPath = config.specRunnerFile;
  }

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
    if (done) { done(); }
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
 * Formatter for bytediff to display the size changes after processing
 * @param  {Object} data - byte data
 * @return {String}    Difference in bytes, formatted
 */
function bytediffFormatter(data) {
  var difference = (data.savings > 0) ? ' smaller.' : ' larger.';
  return data.fileName + ' went from ' +
    (data.startSize / 1000).toFixed(2) + ' kB to ' +
    (data.endSize / 1000).toFixed(2) + ' kB and is ' +
    formatPercent(1 - data.percent, 2) + '%' + difference;
}

/**
 * Format a number as a percentage
 * @param  {Number} num     Number to format as a percent
 * @param  {Number} precision Precision of the decimal
 * @return {String}       Formatted perentage
 */
function formatPercent(num, precision) {
  return (num * 100).toFixed(precision);
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

/**
 * Show OS level notification using node-notifier
 */
function notify(options) {
  var notifier = require('node-notifier');
  var notifyOptions = {
    sound: 'Bottle',
    contentImage: path.join(__dirname, 'gulp.png'),
    icon: path.join(__dirname, 'gulp.png')
  };
  _.assign(notifyOptions, options);
  notifier.notify(notifyOptions);
}

module.exports = gulp;
