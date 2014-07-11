/* jshint node: true */

var gulp = require('gulp'),
  FetchStream = require('fetch').FetchStream,
  fs = require('fs'),
  inquirer = require('inquirer'),
  install = require('gulp-install'),
  q = require('q'),
  rename = require('gulp-rename'),
  spawn = require('child_process').spawn,
  win32 = process.platform === 'win32',
  _ = require('underscore.string')
  ;

function getNameProposal () {
  'use strict';

  var path = require('path');
  try {
    return require(path.join(process.cwd(), 'package.json')).name;
  } catch (e) {
    return path.basename(process.cwd());
  }
}

// Download the Roxy ml script from GitHub
function getRoxyScript(appName, appType, branch) {
  'use strict';

  var d = q.defer(),
    out;

  var scriptName = 'ml' + (win32 ? '.bat' : '');

  console.log('Retrieving Roxy script');
  out = fs.createWriteStream(scriptName);
  var stream = new FetchStream('https://github.com/marklogic/roxy/raw/master/' + scriptName);
  stream.pipe(out);
  stream.on('end', function() {
    console.log('Got Roxy script');
    out.end();

    fs.chmod(scriptName, '755', function (err) {
      if (err) {
        console.log(err);
        d.reject(err);
      }
      else {
        console.log ('chmod done; appName=' + appName + '; appType=' + appType + '; branch=' + branch);
        d.resolve({
          'script': scriptName,
          'app': appName,
          'appType': appType,
          'branch': branch
        });
      }
    });
  });

  return d.promise;
}

// Run the Roxy "ml new" command for the new project
function runRoxy(config) {
  'use strict';

  var scriptName = config.script,
    appName = config.app,
    appType = config.appType,
    branch = config.branch;

  var d = q.defer();

  var args = [
    'new',
    appName,
    '--app-type=' + appType,
    '--server-version=7',
    '--branch=' + branch
  ];

  console.log('Spawning Roxy new command: ' + scriptName + ' ' + args.join(' '));
  spawn('./' + scriptName, args).on('close', function() {
    console.log('done running ml new');
    d.resolve('done');
  }).stdout.on('data', function (data) {
    console.log('' + data);
  });

  return d.promise;
}

// Make some changes to Roxy's deploy/build.properties file for the out-of-the-box application
function configRoxy() {
  'use strict';

  console.log('Configuring Roxy');

  var content = fs.readFileSync('deploy/build.properties', { encoding: 'utf8' });

  // set the authentication-method property to digestbasic
  content = content.replace(/^authentication\-method=digest/m, 'authentication-method=digestbasic');

  fs.writeFileSync('deploy/build.properties', content);
}

gulp.task('default', function (done) {
  'use strict';

  inquirer.prompt([
    {type: 'input', name: 'name', message: 'Name for the app?', default: getNameProposal()},
    {type: 'rawlist', name: 'appType', message: 'Roxy App Type?', choices: ['rest', 'mvc', 'hybrid'], default: 'rest'},
    {type: 'input', name: 'branch', message: 'Roxy Branch?', default: 'master'}
  ],
  function (answers) {

    answers.nameDashed = _.slugify(answers.name);
    answers.modulename = _.camelize(answers.nameDashed);

    getRoxyScript(answers.nameDashed, answers.appType, answers.branch)
      .then(runRoxy)
      .then(function() {
        // Copy over the Angular files

        var files = [__dirname + '/app/templates/**'];

        process.chdir('./' + answers.nameDashed);

        configRoxy();

        gulp.src(files)
          // change _foo to .foo
          .pipe(rename(function (file) {
            if (file.basename[0] === '_') {
              file.basename = '.' + file.basename.slice(1);
            }
          }))
          .pipe(gulp.dest('./')) // Relative to cwd
          .pipe(install())
          .on('end', function () {
            done(); // Finished!
          });
      },
      function(reason) {
        console.log('Caught an error: ' + reason);
      });

  });


});

