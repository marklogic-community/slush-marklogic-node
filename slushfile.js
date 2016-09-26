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
  win32 = process.platform === 'win32';

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
  process.stdout.write('  fork=<..>             Github fork to use for Roxy. Defaults to: marklogic\n');
  process.stdout.write('  branch=<..>           Github branch to use for Roxy. Defaults to: master\n');
  process.stdout.write('  theme=<..>            Slush theme to use. Defaults to: default\n');
  process.stdout.write('  ml-version=<..>       MarkLogic version. Defaults to: 8\n');
  process.stdout.write('  ml-host=<..>          Host on which MarkLogic runs. Defaults to: localhost\n');
  process.stdout.write('  ml-admin-user=<..>    User for MarkLogic deployments. Defaults to: admin\n');
  process.stdout.write('  ml-admin-pass=<..>    Pass for MarkLogic deployments. Defaults to: <blank>\n');
  process.stdout.write('  ml-app-user=<..>      MarkLogic user for guest access. Defaults to: <app-name>-user\n');
  process.stdout.write('  ml-app-pass=<..>      MarkLogic pass for guest access. Defaults to: <roxy-appuser-password>\n');
  process.stdout.write('  ml-http-port=<..>     Port at which MarkLogic app-server runs. Defaults to: 8040\n');
  process.stdout.write('  ml-xcc-port=<..>      Port at which MarkLogic xcc-server runs. Defaults to: <ml-app-port>\n');
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
    'fork',
    'branch',
    'theme',
    'ml-version',
    'ml-host',
    'ml-admin-user',
    'ml-admin-pass',
    'ml-app-user',
    'ml-app-pass',
    'ml-http-port',
    'ml-xcc-port',
    'node-port',
    'guest-access',
    'disallow-updates',
    'appusers-only'
  ];
  var inputs = {
    fork: 'marklogic',
    branch: 'master'
  };
  (gulp.args || process.argv).forEach(function(arg) {
    if (isFlag(arg)) {
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

// Download the Roxy ml script from GitHub
function getRoxyScript(appName, mlVersion, fork, branch) {
  fork = fork || 'marklogic';
  branch = branch || 'master';

  var d = q.defer(),
    out;

  var scriptName = (win32 ? '' : './') + 'ml' + (win32 ? '.bat' : '');

  console.log('Retrieving Roxy script');
  out = fs.createWriteStream(scriptName);
  var stream = new FetchStream('https://github.com/' + fork + '/roxy/raw/' + branch + '/' + scriptName);
  stream.pipe(out);
  stream.on('end', function() {
    console.log('Got Roxy script');
    out.end();

    fs.chmod(scriptName, '755', function(err) {
      if (err) {
        console.log(err);
        d.reject(err);
      } else {
        console.log('chmod done; appName=' + appName + '; mlVersion=' + mlVersion + '; fork=' + fork + '; branch=' + branch);
        d.resolve({
          'script': scriptName,
          'app': appName,
          'mlVersion': mlVersion,
          'fork': fork,
          'branch': branch
        });
      }
    });
  });

  return d.promise;
}

// Run the Roxy "ml new" command for the new project
function runRoxy(config) {
  var scriptName = config.script,
    appName = config.app,
    mlVersion = config.mlVersion,
    fork = config.fork,
    branch = config.branch;

  var d = q.defer();

  var args = [
    'new',
    appName,
    '--server-version=' + mlVersion,
    '--app-type=rest',
    '--fork=' + fork,
    '--branch=' + branch
  ];

  console.log('Spawning Roxy new command: ' + scriptName + ' ' + args.join(' '));
  var child = spawn(scriptName, args, {
    stdio: [
      0, // Use parents stdin for child
      'pipe', // Pipe child's stdout to parent (default)
      'pipe' // Pipe child's stderr to parent (default)
    ]
  });

  child.on('close', function() {
    console.log('done running ml new');
    d.resolve('done');
  });

  child.stdout.on('data', function(data) {
    console.log('' + data);
  });

  child.stderr.on('data', function(data) {
    console.log('' + data);
  });

  return d.promise;
}

// Make some changes to Roxy's deploy/build.properties file for the out-of-the-box application
function configRoxy() {
  console.log('Configuring Roxy');

  try {
    var properties = fs.readFileSync('deploy/build.properties', encoding);

    // Set the authentication-method property to digestbasic
    properties = properties.replace(/^authentication\-method=digest/m, 'authentication-method=digestbasic');

    // Capture appuser-password from Roxy properties for later use
    var passwordMatch = /^appuser\-password=(.*)$/m;
    var matches = passwordMatch.exec(properties);
    settings.appuserPassword = matches[1];

    // Bypass bug in Roxy causing {, } and \ in pwd to get mangled
    if (settings.appuserPassword.match(/[\{\}\\]/g)) {
      settings.appuserPassword = settings.appuserPassword.replace(/[\{\}\\]/g, '');
      properties = properties.replace(passwordMatch, 'appuser-password=' + settings.appuserPassword);
    }

    fs.writeFileSync('deploy/build.properties', properties);
  } catch (e) {
    console.log('failed to update properties: ' + e.message);
    process.exit(1);
  }

  try {
    var localProperties = '#################################################################\n' +
      '# This file contains overrides to values in build.properties\n' +
      '# These only affect your local environment and should not be checked in\n' +
      '#################################################################\n' +
      '\n' +
      'server-version=' + settings.mlVersion + '\n' +
      '\n' +
      '#\n' +
      '# The ports used by your application\n' +
      '#\n' +
      'app-port=' + settings.appPort + '\n';
    if (settings.xccPort || (settings.mlVersion < 8)) {
      localProperties += 'xcc-port=' + settings.xccPort + '\n';
    } else {
      localProperties += '# Taking advantage of not needing a XCC Port for ML8\n' +
        'xcc-port=${app-port}\n' +
        'install-xcc=false\n';
    }

    localProperties += '\n' +
      '#\n' +
      '# the uris or IP addresses of your servers\n' +
      '# WARNING: if you are running these scripts on WINDOWS you may need to change localhost to 127.0.0.1\n' +
      '# There have been reported issues with dns resolution when localhost wasn\'t in the hosts file.\n' +
      '#\n' +
      'local-server=' + settings.marklogicHost + '\n' +
      'content-forests-per-host=3\n' +
      '\n' +
      '#\n' +
      '# Admin username/password that will exist on the local/dev/prod servers\n' +
      '#\n' +
      'user=' + settings.marklogicAdminUser + '\n' +
      'password=' + settings.marklogicAdminPass + '\n';

    fs.writeFileSync('deploy/local.properties', localProperties, encoding);
  } catch (e) {
    console.log('failed to write roxy local.properties');
    process.exit(1);
  }

  try {
    var foo = fs.readFileSync('deploy/ml-config.xml', encoding);

    // add an index for the default content
    foo = foo.replace(/^\s*<range-element-indexes>/m,
      '      <range-element-indexes>\n' +
      '        <range-element-index>\n' +
      '          <scalar-type>string</scalar-type>\n' +
      '          <namespace-uri/>\n' +
      '          <localname>eyeColor</localname>\n' +
      '          <collation>http://marklogic.com/collation/codepoint</collation>\n' +
      '          <range-value-positions>false</range-value-positions>\n' +
      '        </range-element-index>\n');

    // add a geospatial index for the default content
    foo = foo.replace(/^\s*<geospatial-element-pair-indexes>/m,
      '      <geospatial-element-pair-indexes>\n' +
      '        <geospatial-element-pair-index>\n' +
      '          <parent-namespace-uri/>\n' +
      '          <parent-localname>location</parent-localname>\n' +
      '          <latitude-namespace-uri/>\n' +
      '          <latitude-localname>latitude</latitude-localname>\n' +
      '          <longitude-namespace-uri/>\n' +
      '          <longitude-localname>longitude</longitude-localname>\n' +
      '          <coordinate-system>wgs84</coordinate-system>\n' +
      '          <range-value-positions>false</range-value-positions>\n' +
      '        </geospatial-element-pair-index>\n');

    // add range path index for the default content
    foo = foo.replace(/^\s*<range-path-indexes>/m,
        '      <range-path-indexes>\n' +
        '        <range-path-index>\n' +
        '          <scalar-type>string</scalar-type>\n' +
        '          <collation>http://marklogic.com/collation/codepoint</collation>\n' +
        '          <path-expression>docFormat</path-expression>\n' +
        '          <range-value-positions>false</range-value-positions>\n' +
        '          <invalid-values>reject</invalid-values>\n' +
        '        </range-path-index>\n');

    // fix default app-role privileges to match rest-style applications
    foo = foo.replace(/<privileges>[^]*?<\/privileges>/,
      '<privileges>\n' +
      '        <privilege>\n' +
      '          <privilege-name>rest-reader</privilege-name>\n' +
      '        </privilege>\n' +
      '        <!-- remove the rest-writer privilege if read-only access is required -->\n' +
      '        <privilege>\n' +
      '          <privilege-name>rest-writer</privilege-name>\n' +
      '        </privilege>\n' +
      '      </privileges>\n');

    fs.writeFileSync('deploy/ml-config.xml', foo);
  } catch (e) {
    console.log('failed to update configuration: ' + e.message);
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

    if (settings.xccPort || (settings.mlVersion < 8)) {
      configJSON['ml-xcc-port'] = settings.xccPort;
    }

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
  if (!clArgs['ml-version']) {
    prompts.push({
      type: 'list',
      name: 'mlVersion',
      message: 'MarkLogic version?',
      choices: ['8', '7', '6', '5'],
      default: 0
    });
  }
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
      default: 8040
    });
  }
  if (!clArgs['ml-xcc-port']) {
    prompts.push({
      type: 'input',
      name: 'xccPort',
      message: 'XCC port?',
      default: 8041,
      when: function(answers) {
        return (answers.mlVersion || clArgs['ml-version']) < 8;
      }
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
    if (typeof appName === 'undefined') {
      settings.appName = _.slugify(answers.name);
    } else {
      settings.appName = _.slugify(appName);
    }
    settings.mlVersion = answers.mlVersion || clArgs['ml-version'];
    settings.marklogicHost = answers.marklogicHost || clArgs['ml-host'];
    settings.marklogicAdminUser = answers.marklogicAdminUser || clArgs['ml-admin-user'];
    settings.marklogicAdminPass = answers.marklogicAdminPass || clArgs['ml-admin-pass'];
    settings.nodePort = answers.nodePort || clArgs['node-port'];
    settings.appPort = answers.appPort || clArgs['ml-http-port'];
    settings.xccPort = answers.xccPort || clArgs['ml-xcc-port'] || settings.appPort;
    settings.guestAccess = answers.guestAccess || clArgs['guest-access'];
    settings.disallowUpdates = answers.disallowUpdates || clArgs['disallowed-updates'];
    settings.appUsersOnly = answers.appUsersOnly || clArgs['appusers-only'];

    getRoxyScript(settings.appName, settings.mlVersion, clArgs.fork, clArgs.branch)
      .then(runRoxy)
      .then(function() {
          // Copy over the Angular files
          var files = [__dirname + '/app/templates/**'];
          if (answers.theme !== 'default') { // overlay the theme if not the default theme chosen
            files.push(__dirname + '/app/themes/' + (answers.theme || answers.template) + '/**');
          }

          process.chdir('./' + settings.appName);

          configRoxy();

          gulp.src(files)
            .pipe(rename(function(file) {
              // change _foo to .foo
              if (file.basename[0] === '_') {
                file.basename = '.' + file.basename.slice(1);
              }

            }))
            .pipe(replace('@slush-version', pkgSettings.version.trim(), skipBinary))
            .pipe(replace('@sample-app-name', settings.appName, skipBinary))
            .pipe(replace('@sample-app-role', settings.appName + '-role', skipBinary))
            .pipe(replace('@node-port', answers.nodePort, skipBinary))
            .pipe(replace('@ml-http-port', answers.appPort, skipBinary))
            .pipe(replace('@ml-xcc-port', answers.xccPort || answers.appPort, skipBinary))
            .pipe(replace('@ml-host', answers.marklogicHost, skipBinary))
            .pipe(gulp.dest('./')) // Relative to cwd
            .on('end', function() {
              done(); // Finished!
            });
        },
        function(reason) {
          console.log('Caught an error: ' + reason);
        });

  });


});
