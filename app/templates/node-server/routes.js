/*jshint node: true */

'use strict';

var router = require('express').Router();

var authHelper = require('./utils/auth-helper');
var bodyParser = require('body-parser');
var four0four = require('./utils/404')();
var http = require('http');
var options = require('./utils/options')();

authHelper.init();

// [GJo] (#31) Moved bodyParsing inside routing, otherwise it might try to parse uploaded binaries as json..
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

router.get('/user/status', function(req, res) {
  var headers = req.headers;
  noCache(res);

  if (!req.isAuthenticated()) {
    res.send({authenticated: false});
  } else {
    authHelper.getAuthorization(req.session, reqOptions.method, reqOptions.path,
      {
        authHost: reqOptions.hostname || options.mlHost,
        authPort: reqOptions.port || options.mlHttpPort,
        authUser: username,
        authPassword: password
      }
    ).then(function(authorization) {
      var passportUser = req.session.passport.user;
      delete headers['content-length'];
      if (authorization) {
        headers.Authorization = authorization;
      }
      var status = http.get({
        hostname: options.mlHost,
        port: options.mlHttpPort,
        path: '/v1/documents?uri=/api/users/' + passportUser.username + '.json',
        headers: headers
      }, function(response) {
        if (response.statusCode === 200) {
          response.on('data', function(chunk) {
            var json = JSON.parse(chunk);
            if (json.user !== undefined) {
              res.status(200).send({
                authenticated: true,
                username: passportUser.username,
                profile: json.user
              });
            } else {
              console.log('did not find chunk.user');
            }
          });
        } else if (response.statusCode === 404) {
          //no profile yet for user
          res.status(200).send({
            authenticated: true,
            username: passportUser.username,
            profile: {}
          });
        } else {
          res.send({authenticated: false});
        }
      });

      status.on('error', function(e) {
        console.log(JSON.stringify(e));
        console.log('status check failed: ' + e.statusCode);
      });
    });
  }
});

router.post('/user/login', authHelper.handleLocalAuth);

router.get('/user/logout', function(req, res) {
  noCache(res);
  if (req.session.authenticator) {
    authHelper.clearAuthenticator(req.session);
    delete req.session.authenticator;
  }
  req.logout();
  res.send();
});

router.get('/*', four0four.notFoundMiddleware);

function noCache(response) {
  response.append('Cache-Control', 'no-cache, must-revalidate');//HTTP 1.1 - must-revalidate
  response.append('Pragma', 'no-cache');//HTTP 1.0
  response.append('Expires', 'Sat, 26 Jul 1997 05:00:00 GMT'); // Date in the past
}

function authStatus(authenticated, username, profile) {
  return {
    authenticated: authenticated,
    username: username,
    profile: profile || {},
    guestAccess: options.guestAccess,
    disallowUpdates: options.disallowUpdates,
    appUsersOnly: options.appUsersOnly,
    appName: options.appName
  };
}

module.exports = router;
