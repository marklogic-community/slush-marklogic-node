/* jshint node: true */

'use strict';

var gulp = require('gulp'),
  FetchStream = require('fetch').FetchStream,
  fs = require('fs'),
  inquirer = require('inquirer'),
  install = require('gulp-install'),
  q = require('q'),
  rename = require('gulp-rename'),
  replace = require('gulp-replace'),
  pkgSettings = require('./package.json'),
  spawn = require('child_process').spawn,
  uuid = require('node-uuid'),
  win32 = process.platform === 'win32',
  xmlpoke = require('gulp-xmlpoke');

/* jshint ignore:start */
var colors = require('colors'),
  _ = require('underscore.string');
/* jshint ignore:end */

var npmVersion = null;

var settings = {};

var encoding = {
  encoding: 'utf8'
};

var skipBinary = {
  skipBinary: true
};

function printUsage() {
  process.stdout.write('\n');
  process.stdout.write('Usage:\n');
  process.stdout.write('  slush marklogic-node <app-name> [args]\n');
  process.stdout.write('\n');
  process.stdout.write('Arguments:\n');
  process.stdout.write('  theme=<..>            Slush theme to use. Defaults to: default\n');
  process.stdout.write('  ml-host=<..>          Host on which MarkLogic runs. Defaults to: localhost\n');
  process.stdout.write('  ml-admin-user=<..>    User for MarkLogic deployments. Defaults to: admin\n');
  process.stdout.write('  ml-admin-pass=<..>    Pass for MarkLogic deployments. Defaults to: <blank>\n');
  process.stdout.write('  ml-app-user=<..>      MarkLogic user for guest access. Defaults to: <app-name>-user\n');
  process.stdout.write('  ml-app-pass=<..>      MarkLogic pass for guest access. Defaults to: <roxy-appuser-password>\n');
  process.stdout.write('  ml-http-port=<..>     Port at which MarkLogic app-server runs. Defaults to: 8070\n');
  process.stdout.write('  node-port=<..>        Port at which Node.js middle-tier runs. Defaults to: 9070\n');
  process.stdout.write('  guest-access=<..>     Whether guests are automatically logged in. Defaults to: false\n');
  process.stdout.write('  disallow-updates=<..> Whether updates to MarkLogic should be disallowed. Defaults to: false\n');
  process.stdout.write('  appusers-only=<..>    Whether front-end users get prefixed with <app-name>-. Defaults to: false\n');
  process.stdout.write('\n');
  process.stdout.write('Note:\n');
  process.stdout.write('  Using command-line arguments will suppress the relevant questions.\n');
  process.stdout.write('  To suppress all, provide arguments for all.\n');
  process.stdout.write('\n');
}

function printVersionWarning() {
  if (npmVersion && npmVersion !== pkgSettings.version.trim()) {
    process.stdout.write('\n------------------------------------\n'.red);
    process.stdout.write('Slush MarkLogic Node is out of date:\n'.bold.yellow);
    process.stdout.write((' * Locally installed version: ' + pkgSettings.version + '\n').yellow);
    process.stdout.write((' * Latest version: ' + npmVersion + '\n').yellow);
    process.stdout.write(' * Run '.yellow + 'npm install -g slush-marklogic-node'.bold + ' to update\n'.yellow);
    process.stdout.write('------------------------------------\n\n'.red);
    npmVersion = null;
  }
}

function checkLatestVersion() {
  var latestVersion = q.defer();

  try {
    console.log('checking for latest version');
    /* jshint camelcase:false */
    var proxy = process.env.PROXY || process.env.http_proxy || null;
    /* jshint camelcase:true */
    var request = require('request');
    request({
      url: 'http://registry.npmjs.org/slush-marklogic-node/latest',
      proxy: proxy
    }, function(err, res, body) {
      try {
        npmVersion = JSON.parse(body).version;
      } catch (e) {}
      latestVersion.resolve();
    });
  } catch (e) {
    latestVersion.resolve();
  }

  return latestVersion.promise;
}

function isFlag(arg) {
  return (arg.indexOf('=') > -1);
}

function processInput() {
  var allowedFlags = [
    'app-name',
    'theme',
    'ml-host',
    'ml-admin-user',
    'ml-admin-pass',
    'ml-app-user',
    'ml-app-pass',
    'ml-http-port',
    'node-port',
    'guest-access',
    'disallow-updates',
    'appusers-only'
  ];
  var inputs = {};
  (gulp.args || process.argv).forEach(function(arg) {
    if (arg === 'help') {
      printUsage();
      process.exit(0);
    } else if (isFlag(arg)) {
      var splits = arg.split('=');
      var flag = splits[0].replace(/^-+/,'');
      var value = splits[1];
      if (flag === 'gulpfile') {
        // ignore
      } else if (allowedFlags.indexOf(flag) >= 0) {
        inputs[flag] = value;
      } else {
        process.stdout.write(('\nERROR: unsupported argument \'' + arg + '\'.\n').red);
        printUsage();
        process.exit(1);
      }
    } else {
      inputs['app-name'] = arg;
    }
  });
  return inputs;
}

function getNameProposal() {
  var path = require('path');
  try {
    return require(path.join(process.cwd(), 'package.json')).name;
  } catch (e) {
    return path.basename(process.cwd());
  }
}

// Make some changes to Gradle's gradle.properties file for the out-of-the-box application
function configGradle() {
  console.log('Generating local overrides for gradle.properties');

  try {
    var properties = fs.readFileSync(__dirname + '/app/templates/gradle.properties', encoding);   

    // Capture appuser-password from gradle properties for later use
    var passwordMatch = /^appUserPassword=(.*)$/m;
    var matches = passwordMatch.exec(properties);
    settings.appuserPassword = matches[1];

    // Bypass bug in Roxy causing {, } and \ in pwd to get mangled
	// Is this needed for gradle?
    if (settings.appuserPassword.match(/[\{\}\\]/g)) {
      settings.appuserPassword = settings.appuserPassword.replace(/[\{\}\\]/g, '');
      properties = properties.replace(passwordMatch, 'appUserPassword=' + settings.appuserPassword);
    }

    fs.writeFileSync('gradle.properties', properties);
  } catch (e) {
    console.log('failed to update gradle.properties: ' + e.message);
    process.exit(1);
  }

  try {
    var localProperties = '#################################################################\n' +
      '# This file contains overrides to values in gradle.properties\n' +
      '# These only affect your local environment and should not be checked in\n' +
      '#################################################################\n' +
      '\n' +
      'mlAppName=' + settings.appName + '\n' + 
      '\n' +
      '#\n' +
      '# The ports used by your application\n' +
      '#\n' +
      'mlRestPort=' + settings.appPort + '\n';

    localProperties += '\n' +
      '#\n' +
      '# the uris or IP addresses of your servers\n' +
      '# WARNING: if you are running these scripts on WINDOWS you may need to change localhost to 127.0.0.1\n' +
      '# There have been reported issues with dns resolution when localhost wasn\'t in the hosts file.\n' +
      '#\n' +
      'mlHost=' + settings.marklogicHost + '\n' +
      'content-forests-per-host=3\n' +
      '\n' +
      '#\n' +
      '# Admin username/password that will exist on the local/dev/prod servers\n' +
      '#\n' +
      'mlUsername=' + settings.marklogicAdminUser + '\n' +
      'mlPassword=' + settings.marklogicAdminPass + '\n';

    fs.writeFileSync('gradle-local.properties', localProperties, encoding);
  } catch (e) {
    console.log('failed to write gradle-local.properties');
    process.exit(1);
  }
}

gulp.task('npmInstall', ['init', 'generateSecret', 'configGulp'], function(done) {
  return gulp.src(['./package.json'])
    .pipe(install({
      args: ['--msvs_version=2013'] // npm install --msvs_version=2013 // node-gyph depends on Visual C++ on Win
    }));
});

gulp.task('default', ['npmInstall'], function(done) {
  return gulp.src(['./bower.json'])
    .pipe(install());
});

gulp.task('generateSecret', ['init'], function(done) {
  try {

    var nodeApp = fs.readFileSync('node-server/node-app.js', encoding);

    //generate new uuid
    var secret = uuid.v4();
    nodeApp = nodeApp.replace(/\bsecret: '\b.*\b'/m, 'secret: \'' + secret + '\'');

    fs.writeFileSync('node-server/node-app.js', nodeApp);
  } catch (e) {
    console.log('failed to update SECRET in node-server/node-app.js: ' + e.message);
    process.exit(1);
  }

  done();
});

gulp.task('configGulp', ['init'], function(done) {

  try {
    var configJSON = {};
    configJSON['app-name'] = settings.appName;
    configJSON['ml-version'] = settings.mlVersion;
    configJSON['ml-host'] = settings.marklogicHost;
    configJSON['ml-admin-user'] = settings.marklogicAdminUser;
    configJSON['ml-admin-pass'] = settings.marklogicAdminPass;
    configJSON['ml-app-user'] = settings.appName + '-user';
    configJSON['ml-app-pass'] = settings.appuserPassword;
    configJSON['ml-http-port'] = settings.appPort;
    configJSON['node-port'] = settings.nodePort;
    configJSON['guest-access'] = settings.guestAccess;
    configJSON['disallow-updates'] = settings.disallowUpdates;
    configJSON['appusers-only'] = settings.appUsersOnly;

    var configString = JSON.stringify(configJSON, null, 2) + '\n';
    fs.writeFileSync('local.json', configString, encoding);
  } catch (e) {
    console.log('failed to write local.json: ' + e.message);
    process.exit(1);
  }

  done();
});

gulp.task('checkForUpdates', function(done) {
  checkLatestVersion().then(function() {
    printVersionWarning();
    done();
  });
});

gulp.task('init', ['checkForUpdates'], function(done) {
  var clArgs = processInput();
  var appName = clArgs['app-name'];

  var prompts = [];
  
  if (!clArgs['ml-host']) {
    prompts.push({
      type: 'input',
      name: 'marklogicHost',
      message: 'MarkLogic Host?',
      default: 'localhost'
    });
  }
  if (!clArgs['ml-admin-user']) {
    prompts.push({
      type: 'input',
      name: 'marklogicAdminUser',
      message: 'MarkLogic Admin User?',
      default: 'admin'
    });
  }
  if (!clArgs['ml-admin-pass']) {
    prompts.push({
      type: 'input',
      name: 'marklogicAdminPass',
      message: 'Note: consider keeping the following blank, ' +
        'you will be asked to enter it at appropriate commands.\n? MarkLogic Admin Password?',
      default: ''
    });
  }
  if (!clArgs['ml-http-port']) {
    prompts.push({
      type: 'input',
      name: 'appPort',
      message: 'MarkLogic App/Rest port?',
      default: 8070
    });
  }
  if (!clArgs['node-port']) {
    prompts.push({
      type: 'input',
      name: 'nodePort',
      message: 'Node app port?',
      default: 9070
    });
  }
  if (!clArgs.theme) {
    prompts.push({
      type: 'list',
      name: 'template',
      message: 'Select Template',
      choices: [{
        name: 'default',
        value: 'default'
      }, {
        name: '3-columns',
        value: '3column'
      }, {
        name: 'Cards',
        value: 'cards'
      }, {
        name: 'Dashboard',
        value: 'dashboard'
      }, {
        name: 'Full-screen map',
        value: 'map'
      }, {
        name: 'I don\'t know',
        value: 'unsure'
      }]
    });
    prompts.push({
      type: 'list',
      name: 'theme',
      message: 'What is the main focus?',
      when: function(ans) {
        return ans.template === 'unsure';
      },
      choices: [{
        name: 'Semantics',
        value: '3column'
      }, {
        name: 'Charts',
        value: 'dashboard'
      }, {
        name: 'Map/Graph',
        value: 'map'
      }, {
        name: 'Data records',
        value: 'cards'
      }, {
        name: 'Documents',
        value: '3column'
      }, {
        name: 'Other',
        value: 'default'
      }]
    });
  }
  if (!clArgs['guest-access']) {
    prompts.push({
      type: 'list',
      name: 'guestAccess',
      message: 'Allow anonymous users to search data?',
      choices: ['false', 'true'],
      default: 0
    });
  }
  if (!clArgs['disallow-updates']) {
    prompts.push({
      type: 'list',
      name: 'disallowUpdates',
      message: 'Disallow proxying update requests?',
      choices: ['false', 'true'],
      default: 0
    });
  }
  if (!clArgs['appusers-only']) {
    prompts.push({
      type: 'list',
      name: 'appUsersOnly',
      message: 'Only allow access to users created for this app? Note: disallows admin users.',
      choices: ['false', 'true'],
      default: 0
    });
  }

  if (typeof appName === 'undefined') {
    prompts.unshift({
      type: 'input',
      name: 'name',
      message: 'Name for the app?',
      default: getNameProposal()
    });
  }

  inquirer.prompt(prompts, function(answers) {
    // consolidate answers, clArgs, and defaults
    if (typeof appName === 'undefined') {
      settings.appName = _.slugify(answers.name);
    } else {
      settings.appName = _.slugify(appName);
    }
    settings.marklogicHost = answers.marklogicHost || clArgs['ml-host'];
    settings.marklogicAdminUser = answers.marklogicAdminUser || clArgs['ml-admin-user'];
    settings.marklogicAdminPass = answers.marklogicAdminPass || clArgs['ml-admin-pass'] || '';
    settings.nodePort = answers.nodePort || clArgs['node-port'];
    settings.appPort = answers.appPort || clArgs['ml-http-port'];
    settings.guestAccess = answers.guestAccess || clArgs['guest-access'];
    settings.disallowUpdates = answers.disallowUpdates || clArgs['disallowed-updates'];
    settings.appUsersOnly = answers.appUsersOnly || clArgs['appusers-only'];
    settings.theme = answers.theme || answers.template || clArgs.theme || 'default';

    var files = [__dirname + '/app/templates/**'];
    if (settings.theme !== 'default') {
	  // overlay the theme if not the default theme chosen
      files.push(__dirname + '/app/themes/' + settings.theme + '/**');
    }

    if(!fs.existsSync('./' + settings.appName)) {
      fs.mkdirSync('./' + settings.appName);
    }
    process.chdir('./' + settings.appName);

    configGradle();

    gulp.src(files)
      .pipe(rename(function(file) {
        // change _foo to .foo
        if (file.basename[0] === '_') {
          file.basename = '.' + file.basename.slice(1);
        }

      }))
      .pipe(replace('@slush-version', pkgSettings.version.trim(), skipBinary))
      .pipe(replace('@sample-app-name', settings.appName, skipBinary))
      .pipe(replace('@node-port', settings.nodePort, skipBinary))
      .pipe(replace('@ml-http-port', settings.appPort, skipBinary))
      .pipe(replace('@ml-host', settings.marklogicHost, skipBinary))
      .pipe(gulp.dest('./')) // Relative to cwd
      .on('end', function() {
        done(); // Finished!
      });
  });


});
