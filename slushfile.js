/* jshint node: true */

'use strict';

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

var settings = {
  mapType: 'none'
};


function getNameProposal () {
  var path = require('path');
  try {
    return require(path.join(process.cwd(), 'package.json')).name;
  } catch (e) {
    return path.basename(process.cwd());
  }
}

// Download the Roxy ml script from GitHub
function getRoxyScript(appName, mlVersion, appType, branch) {

  var d = q.defer(),
    out;

  var scriptName = (win32 ? '' : './') + 'ml' + (win32 ? '.bat' : '');

  console.log('Retrieving Roxy script');
  out = fs.createWriteStream(scriptName);
  var stream = new FetchStream('https://github.com/marklogic/roxy/raw/' + branch + '/' + scriptName);
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
        console.log ('chmod done; appName=' + appName + '; mlVersion=' + mlVersion + '; appType=' + appType + '; branch=' + branch);
        d.resolve({
          'script': scriptName,
          'app': appName,
          'mlVersion': mlVersion,
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
  var scriptName = config.script,
    appName = config.app,
    mlVersion = config.mlVersion,
    appType = config.appType,
    branch = config.branch;

  var d = q.defer();

  var args = [
    'new',
    appName,
    '--server-version=' + mlVersion,
    '--app-type=' + appType,
    '--branch=' + branch
  ];

  console.log('Spawning Roxy new command: ' + scriptName + ' ' + args.join(' '));
  var child = spawn(scriptName, args);

  child.on('close', function() {
    console.log('done running ml new');
    d.resolve('done');
  });

  child.stdout.on('data', function (data) {
    console.log('' + data);
  });

  child.stderr.on('data', function (data) {
    console.log('' + data);
  });

  return d.promise;
}

// Make some changes to Roxy's deploy/build.properties file for the out-of-the-box application
function configRoxy() {
  console.log('Configuring Roxy');

  try {

    var properties = fs.readFileSync('deploy/build.properties', { encoding: 'utf8' });

    // set the authentication-method property to digestbasic
    properties = properties.replace(/^authentication\-method=digest/m, 'authentication-method=digestbasic');

    fs.writeFileSync('deploy/build.properties', properties);
  } catch (e) {
    console.log('failed to update properties: ' + e.message);
  }

  try {
    var foo = fs.readFileSync('deploy/ml-config.xml', { encoding: 'utf8' });

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

    fs.writeFileSync('deploy/ml-config.xml', foo);
  } catch (e) {
    console.log('failed to update configuration: ' + e.message);
  }

}

gulp.task('default', ['init', 'configMaps'], function(done) {
  gulp.src(['./bower.json', './package.json'])
   .pipe(install());
});

gulp.task('configMaps', ['init'], function(done) {
  if (settings.mapType === 'esri') {
    var bowerData, indexData, appData;

    try {
      // Update the bower.json file.
      bowerData = fs.readFileSync('bower.json', { encoding: 'utf8' });
      bowerData = bowerData.replace(/^.*google.*$[\r\n]/gm, '');
      fs.writeFileSync('bower.json', bowerData);
    } catch (e) {
      console.log('failed to update bower.json: ' + e.message);
    }

    try {
      // Update the index.html file.
      indexData = fs.readFileSync('ui/app/index.html', { encoding: 'utf8' });
      indexData = indexData.replace(/^.*google.*$[\r\n]/gm, '');
      indexData = indexData.replace(/^.*search-map-ctrl.*$[\r\n]/gm, '');
      indexData = indexData.replace(/^.*\/map.*$[\r\n]/gm, '');
      fs.writeFileSync('ui/app/index.html', indexData);
    } catch (e) {
      console.log('failed to update index.html: ' + e.message);
    }

    try {
      // Update the app.js file.
      appData = fs.readFileSync('ui/app/app.js', { encoding: 'utf8' });
      appData = appData.replace(/^.*uiGmapgoogle-maps.*$[\r\n]/gm, '');
      appData = appData.replace(/^.*sample\.searchMap.*$[\r\n]/gm, '');
      appData = appData.replace(/^.*\/map[\s\S]*otherwise/gm, '      .otherwise');
      fs.writeFileSync('ui/app/app.js', appData);
    } catch (e) {
      console.log('failed to update app.js: ' + e.message);
    }
  }
  else if (settings.mapType === 'google') {
    var mlConfig, indexData;

    try {
      var mlConfig = fs.readFileSync('deploy/ml-config.xml', { encoding: 'utf8' });

      // add an index for the geospatial content
      mlConfig = mlConfig.replace(/^\s*<geospatial-element-pair-indexes>/m,
        '      <geospatial-element-pair-indexes>\n' +
        '        <geospatial-element-pair-index>\n' +
        '          <parent-namespace-uri>http://marklogic.com/xdmp/json/basic</parent-namespace-uri>\n' +
        '          <parent-localname>json</parent-localname>\n' +
        '          <latitude-namespace-uri>http://marklogic.com/xdmp/json/basic</latitude-namespace-uri>\n' +
        '          <latitude-localname>latitude</latitude-localname>\n' +
        '          <longitude-namespace-uri>http://marklogic.com/xdmp/json/basic</longitude-namespace-uri>\n' +
        '          <longitude-localname>longitude</longitude-localname>\n' +
        '          <coordinate-system>wgs84</coordinate-system>\n' +
        '          <range-value-positions>true</range-value-positions>\n' +
        '        </geospatial-element-pair-index>\n');

      fs.writeFileSync('deploy/ml-config.xml', mlConfig);
    } catch (e) {
      console.log('failed to add geospatial index configuration: ' + e.message);
    }

    try {
      // Update the index.html file.
      indexData = fs.readFileSync('ui/app/index.html', { encoding: 'utf8' });
      indexData = indexData.replace(/^.*arcgis.*$[\r\n]/gm, '');
      indexData = indexData.replace(/^.*esri.*$[\r\n]/gm, '');
      fs.writeFileSync('ui/app/index.html', indexData);
    } catch (e) {
      console.log('failed to update index.html: ' + e.message);
    }
  }
  else {
    var bowerData, indexData, appData;

    try {
      // Update the bower.json file.
      bowerData = fs.readFileSync('bower.json', { encoding: 'utf8' });
      bowerData = bowerData.replace(/^.*google.*$[\r\n]/gm, '');
      fs.writeFileSync('bower.json', bowerData);
    } catch (e) {
      console.log('failed to update bower.json: ' + e.message);
    }

    try {
      // Update the index.html file.
      indexData = fs.readFileSync('ui/app/index.html', { encoding: 'utf8' });
      indexData = indexData.replace(/^.*arcgis.*$[\r\n]/gm, '');
      indexData = indexData.replace(/^.*esri.*$[\r\n]/gm, '');
      indexData = indexData.replace(/^.*google.*$[\r\n]/gm, '');
      indexData = indexData.replace(/^.*map.*$[\r\n]/gm, '');
      fs.writeFileSync('ui/app/index.html', indexData);
    } catch (e) {
      console.log('failed to update index.html: ' + e.message);
    }

    try {
      // Update the app.js file.
      appData = fs.readFileSync('ui/app/app.js', { encoding: 'utf8' });
      appData = appData.replace(/^.*esriMap.*$[\r\n]/gm, '');
      appData = appData.replace(/^.*uiGmapgoogle-maps.*$[\r\n]/gm, '');
      appData = appData.replace(/^.*sample\.detailMap.*$[\r\n]/gm, '');
      appData = appData.replace(/^.*sample\.searchMap.*$[\r\n]/gm, '');
      appData = appData.replace(/^.*\/map[\s\S]*otherwise/gm, '      .otherwise');
      fs.writeFileSync('ui/app/app.js', appData);
    } catch (e) {
      console.log('failed to update app.js: ' + e.message);
    }
  }

  done();
});

gulp.task('init', function (done) {
  inquirer.prompt([
    {type: 'input', name: 'name', message: 'Name for the app?', default: getNameProposal()},
    {type: 'list', name: 'mlVersion', message: 'MarkLogic version?', choices: ['8','7', '6', '5'], default: 0},
    {type: 'list', name: 'appType', message: 'Roxy App Type?', choices: ['rest', 'mvc', 'hybrid'], default: 0},
    {type: 'list', name: 'branch', message: 'Roxy Branch?', choices: ['master', 'dev'], default: 0},
    {type: 'list', name: 'mapType', message: 'Map Type?', choices: ['none', 'google', 'esri'], default: 0}
  ],
  function (answers) {
    answers.nameDashed = _.slugify(answers.name);
    answers.modulename = _.camelize(answers.nameDashed);
    settings.mapType   = answers.mapType;

    getRoxyScript(answers.nameDashed, answers.mlVersion, answers.appType, answers.branch)
      .then(runRoxy)
      .then(function() {
        // Copy over the Angular files
        var files = [__dirname + '/app/templates/**'];

        // Adjust files to copy based on selected map type
        if ('esri' === answers.mapType) {
          files.push('!' + __dirname + '/app/templates/rest-api/config/options/map.xml');
          files.push('!' + __dirname + '/app/templates/ui/app/detail/detail-no-map.html');
          files.push('!' + __dirname + '/app/templates/ui/app/detail/detail-map-dir.google.js');
          files.push('!' + __dirname + '/app/templates/ui/app/search-map/**');
          files.push('!' + __dirname + '/app/templates/ui/app/search-map');
        }
        else if ('google' === answers.mapType) {
          files.push('!' + __dirname + '/app/templates/ui/app/detail/detail-no-map.html');
          files.push('!' + __dirname + '/app/templates/ui/app/detail/detail-map-dir.esri.js');
        }
        else {
          files.push('!' + __dirname + '/app/templates/rest-api/config/options/map.xml');
          files.push('!' + __dirname + '/app/templates/ui/app/detail/detail-map-dir.esri.js');
          files.push('!' + __dirname + '/app/templates/ui/app/detail/detail-map-dir.google.js');
          files.push('!' + __dirname + '/app/templates/ui/app/search-map/**');
          files.push('!' + __dirname + '/app/templates/ui/app/search-map');
          files.push('!' + __dirname + '/app/templates/ui/app/detail/detail.html');
        }

        process.chdir('./' + answers.nameDashed);

        configRoxy();

        gulp.src(files)
          .pipe(rename(function (file) {
            // change _foo to .foo
            if (file.basename[0] === '_') {
              file.basename = '.' + file.basename.slice(1);
            }
            // Rename detail file when not using a map.
            else if ('none' === answers.mapType && file.basename === 'detail-no-map' && file.extname === '.html') {
              console.log('changed name to detail.html');
              file.basename = 'detail';
            }
            // Rename detail-map-directive file when using google
            else if ('google' === answers.mapType && file.basename === 'detail-map-dir.google' && file.extname === '.js') {
              console.log('changed name to detail-map-dir.js');
              file.basename = 'detail-map-dir';
            }
            // Rename detail-map-directive file when using esri
            else if ('esri' === answers.mapType && file.basename === 'detail-map-dir.esri' && file.extname === '.js') {
              console.log('changed name to detail-map-dir.js');
              file.basename = 'detail-map-dir';
            }

          }))
          .pipe(gulp.dest('./')) // Relative to cwd
          .on('end', function () {
            done(); // Finished!
          });
      },
      function(reason) {
        console.log('Caught an error: ' + reason);
      });

  });


});
