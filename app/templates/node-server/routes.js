/*jshint node: true */

'use strict';

var router = require('express').Router();

var authHelper = require('./utils/auth-helper');
var bodyParser = require('body-parser');
var four0four = require('./utils/404')();
var options = require('./utils/options')();
var http = require('http');
var https = require('https');
var fs = require('fs');

var ca = '';
var httpClient = null;
if (options.mlCertificate) {
  console.log('Loading ML Certificate ' + options.mlCertificate);
  ca = fs.readFileSync(options.mlCertificate);
  httpClient = https;
} else {
  httpClient = http;
}

// [GJo] (#31) Moved bodyParsing inside routing, otherwise it might try to parse uploaded binaries as json..
router.use(bodyParser.urlencoded({
  extended: true
}));
router.use(bodyParser.json());

router.get('/user/status', function(req, res) {
  var headers = req.headers;
  noCache(res);
  if (!req.isAuthenticated()) {
    if (options.guestAccess) {
      res.send(authStatus(
        true,
        options.defaultUser, {
          fullname: 'Guest'
        }
      ));
    } else {
      res.send(authStatus(
        false
      ));
    }
  } else {
    var passportUser = req.session.passport.user;
    var path = '/v1/documents?uri=/api/users/' + passportUser.username + '.json';
    var reqOptions = {
      hostname: options.mlHost,
      port: options.mlHttpPort,
      method: req.method,
      path: path,
      headers: req.headers
    };

    delete headers['content-length'];
    authHelper.getAuthorization(req.session, reqOptions.method, reqOptions.path, {
      authHost: reqOptions.hostname || options.mlHost,
      authPort: reqOptions.port || options.mlHttpPort,
      authUser: passportUser.username,
      authPassword: passportUser.password
    }).then(
      function(authorization) {
        delete headers['content-length'];
        if (authorization) {
          headers.Authorization = authorization;
        }
        var profile = httpClient.get({
          hostname: options.mlHost,
          port: options.mlHttpPort,
          path: path,
          headers: headers,
          ca: ca
        }, function(response) {
          if (response.statusCode === 200) {
            response.on('data', function(chunk) {
              var json = JSON.parse(chunk);
              if (json.user === undefined) {
                console.log('did not find chunk.user');
              }
              res.status(200).send(authStatus(
                true,
                passportUser.username,
                json.user
              ));
            });
          } else if (response.statusCode === 404) {
            //no profile yet for user
            res.status(200).send(authStatus(
              true,
              passportUser.username,
              null
            ));
          } else {
            res.send(authStatus(
              false
            ));
          }
        });

        profile.on('socket', function(socket) {
          socket.on('timeout', function() {
            console.log('Timeout reached, aborting call to ML..');
            profile.abort();
          });
        });

        profile.on('error', function(e) {
          console.log('Status check failed: ' + e.message);
          res.status(500).end();
        });

      });
  }
});

router.post('/user/login', function(req, res, next) {
  // Attempt to read the user's profile, then check the response code.
  // 404 - valid credentials, but no profile yet
  // 401 - bad credentials
  var username = req.body.username || '';

  //make sure login isn't cached
  noCache(res);

  var startsWithMatch = new RegExp('^' + options.appName + '-');
  if (options.appUsersOnly && !startsWithMatch.test(username)) {
    res.status(403).send('Forbidden');
  } else {
    authHelper.handleLocalAuth(req, res, next);
  }
});

router.get('/user/logout', function(req, res) {
  noCache(res);
  req.logout();
  authHelper.clearAuthenticator(req.session);
  res.send();
});

router.get('/*', four0four.notFoundMiddleware);

function noCache(response) {
  response.append('Cache-Control', 'no-cache, must-revalidate'); //HTTP 1.1 - must-revalidate
  response.append('Pragma', 'no-cache'); //HTTP 1.0
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
