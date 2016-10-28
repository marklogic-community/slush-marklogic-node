/*jshint node:true*/
'use strict';

var express = require('express');
var helmet = require('helmet');
var expressSession = require('express-session');
var app = express();
var logger = require('morgan');
var four0four = require('./utils/404')();

var options = require('./utils/options')();
var passport = require('passport');
var port = options.appPort;
var environment = options.env;

// Making this middle-tier slightly more secure: https://www.npmjs.com/package/helmet#how-it-works
app.use(helmet({
  csp: { // enable and configure
    directives: {
      defaultSrc: ['"self"']
    },
    setAllHeaders: true
  },
  dnsPrefetchControl: true, // just enable, with whatever defaults
  xssFilter: { // enabled by default, but override defaults
    setOnOldIE: true
  },
  noCache: false // make sure it is disabled
}));

app.use(expressSession({
  name: '@sample-app-name',
  secret: '1234567890QWERTY',
  saveUninitialized: true,
  resave: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));

app.use('/v1', require('./proxy'));
app.use('/api', require('./routes'));

console.log('About to crank up node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);

switch (environment){
  case 'prod':
  case 'dev':
    console.log('** DIST **');
    app.use(express.static('./dist/'));
    // Any invalid calls for templateUrls are under app/* and should return 404
    app.use('/app/*', function(req, res, next) {
      four0four.send404(req, res);
    });
    // Any deep link calls should return index.html
    app.use('/*', express.static('./dist/index.html'));
    break;
  default:
    console.log('** UI **');
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
