/*jshint node:true*/
'use strict';

var express = require('express');
var expressSession = require('express-session');
var app = express();
var logger = require('morgan');
var four0four = require('./utils/404')();

var options = require('./utils/options')();
var port = options.appPort;
var environment = options.env;

app.use(expressSession({
  name: '@sample-app-name',
  secret: '1234567890QWERTY',
  saveUninitialized: true,
  resave: true
}));

app.use(logger('dev'));

app.use('/v1', require('./proxy'));
app.use('/api', require('./routes'));

console.log('About to crank up node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);

switch (environment){
  case 'prod':
  case 'dev':
    console.log('** BUILD **');
    app.use(express.static('./dist/'));
    // Any invalid calls for templateUrls are under app/* and should return 404
    app.use('/app/*', function(req, res, next) {
      four0four.send404(req, res);
    });
    // Any deep link calls should return index.html
    app.use('/*', express.static('./dist/index.html'));
    break;
  default:
    console.log('** DEV **');
    app.use(express.static('./ui/'));
    app.use(express.static('./')); // for bower_components
    app.use(express.static('./tmp'));
    // Any invalid calls for templateUrls are under app/* and should return 404
    app.use('/app/*', function(req, res, next) {
      four0four.send404(req, res);
    });
    // Any deep link calls should return index.html
    app.use('/*', express.static('./ui/index.html'));
    break;
}

app.listen(port, function() {
  console.log('Express server listening on port ' + port);
  console.log('env = ' + app.get('env') +
    '\n__dirname = ' + __dirname  +
    '\nprocess.cwd = ' + process.cwd());
});
