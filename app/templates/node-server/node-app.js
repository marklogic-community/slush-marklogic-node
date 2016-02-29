/*jshint node:true*/
'use strict';

var express = require('express');
var expressSession = require('express-session');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var port = process.env.PORT || 8001;
var four0four = require('./utils/404')();

var environment = process.env.NODE_ENV;

app.use(expressSession({
  name: '@sample-app-name',
  secret: '1234567890QWERTY',
  saveUninitialized: true,
  resave: true
}));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(logger('dev'));

app.use('/api', require('./routes'));

app.use('/v1', require('./proxy'));

app.use('/create', express.static('./build/index.html'));
app.use('/profile', express.static('./build/index.html'));

console.log('About to crank up node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);

switch (environment){
  case 'build':
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
    app.use(express.static('./'));
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
