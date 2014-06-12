/*jshint node: true */

'use strict';

var gulp = require('gulp');

var argv = require('yargs').argv;
var concat = require('gulp-concat');
var connect = require('connect');
var http = require('http');
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var karma = require('karma').server;
var path = require('path');
var proxy = require('proxy-middleware');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var url = require('url');

var options = {
  appPort: argv['app-port'] || 9070,
  mlHost: argv['ml-host'] || 'localhost',
  mlPort: argv['ml-port'] || '8040'
};

gulp.task('jshint', function() {
  gulp.src('ui/app/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Compile Our Less
gulp.task('less', function() {
  return gulp.src(['ui/app/**/*.js', '!ui/app/bower_components/**/*.js', '!ui/app/scripts/vendor/**/*.js'])
    .pipe(less())
    .pipe(gulp.dest('ui/app/styles/'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
  return gulp.src(['ui/app/**/*.js', '!ui/app/bower_components/**/*.js', '!ui/app/scripts/vendor/**/*.js'])
    .pipe(concat('all.js'))
    .pipe(gulp.dest('dist'))
    .pipe(rename('all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

// Watch Files For Changes
gulp.task('watch', function() {
  gulp.watch('./ui/app/**/*.js', ['jshint', 'scripts']);
  gulp.watch('./ui/app/styles/*.less', ['less']);
});

gulp.task('test', function() {
  karma.start({
    configFile: path.join(__dirname, './karma.conf.js'),
    singleRun: true,
    autoWatch: false
  }, function (exitCode) {
    console.log('Karma has exited with ' + exitCode);
    process.exit(exitCode);
  });
});

gulp.task('autotest', function() {
  karma.start({
    configFile: path.join(__dirname, './karma.conf.js'),
    autoWatch: true
  }, function (exitCode) {
    console.log('Karma has exited with ' + exitCode);
    process.exit(exitCode);
  });
});

gulp.task('server', function() {
  var app = connect()
    .use(connect.static('ui/app'))
    .use('/v1', proxy(url.parse('http://' + options.mlHost + ':' + options.mlPort + '/v1')));
  http.createServer(app).listen(options.appPort);
});

// Default Task
gulp.task('default', ['jshint', 'less', 'scripts', 'watch']);
