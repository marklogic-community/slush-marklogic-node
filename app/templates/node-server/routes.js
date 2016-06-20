/*jshint node: true */

'use strict';

var router = require('express').Router();
var bodyParser = require('body-parser');
var four0four = require('./utils/404')();
var http = require('http');
var options = require('./utils/options')();

// [GJo] (#31) Moved bodyParsing inside routing, otherwise it might try to parse uploaded binaries as json..
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

router.get('/user/status', function(req, res) {
  var headers = req.headers;
  noCache(res);
  if (req.session.user === undefined) {
    if (options.guestAccess) {
      res.send({
        authenticated: true,
        username: options.defaultUser,
        profile: { fullname: 'Guest' },
        guestAccess: options.guestAccess,
        readOnlyAccess: options.readOnlyAccess,
        appUsersOnly: options.appUsersOnly
      });
    } else {
      res.send({
        authenticated: false,
        guestAccess: options.guestAccess,
        readOnlyAccess: options.readOnlyAccess,
        appUsersOnly: options.appUsersOnly
      });
    }
  } else {
    delete headers['content-length'];
    var status = http.get({
      hostname: options.mlHost,
      port: options.mlHttpPort,
      path: '/v1/documents?uri=/api/users/' + req.session.user.username + '.json',
      headers: headers,
      auth: req.session.user.username + ':' + req.session.user.password
    }, function(response) {
      if (response.statusCode === 200) {
        response.on('data', function(chunk) {
          var json = JSON.parse(chunk);
          if (json.user === undefined) {
            console.log('did not find chunk.user');
          }
          res.status(200).send({
            authenticated: true,
            username: req.session.user.username,
            profile: json.user || {},
            guestAccess: options.guestAccess,
            readOnlyAccess: options.readOnlyAccess,
            appUsersOnly: options.appUsersOnly
          });
          req.session.user.profile = json.user || {};
        });
      } else if (response.statusCode === 404) {
        //no profile yet for user
        res.status(200).send({
          authenticated: true,
          username: req.session.user.username,
          profile: req.session.user.profile || {},
          guestAccess: options.guestAccess,
          readOnlyAccess: options.readOnlyAccess,
          appUsersOnly: options.appUsersOnly
        });
      } else {
        res.send({authenticated: false});
      }
    });

    status.on('error', function(e) {
      console.log(JSON.stringify(e));
      console.log('status check failed: ' + e.statusCode);
    });
  }
});

router.post('/user/login', function(req, res) {
  // Attempt to read the user's profile, then check the response code.
  // 404 - valid credentials, but no profile yet
  // 401 - bad credentials
  var username = req.body.username || '';
  var password = req.body.password || '';
  var headers = req.headers;

  //make sure login isn't cached
  noCache(res);

  var startsWithMatch = new RegExp('^' + options.appName + '-');
  if (options.appUsersOnly && !startsWithMatch.test(username)) {
    res.status(403).send('Forbidden');
  } else {
    // remove content length so ML doesn't wait for request body
    // that isn't being passed.
    delete headers['content-length'];

    var login = http.get({
      hostname: options.mlHost,
      port: options.mlHttpPort,
      path: '/v1/documents?uri=/api/users/' + username + '.json',
      headers: headers,
      auth: username + ':' + password
    }, function(response) {

      if (response.statusCode === 401) {
        res.status(401).send('Unauthenticated');
      } else if (response.statusCode === 404) {
        // authentication successful, but no profile defined
        req.session.user = {
          username: username,
          password: password
        };
        res.status(200).send({
          authenticated: true,
          username: username,
          profile: {},
          guestAccess: options.guestAccess,
          readOnlyAccess: options.readOnlyAccess,
          appUsersOnly: options.appUsersOnly
        });
      } else {
        console.log('code: ' + response.statusCode);
        if (response.statusCode === 200) {
          // authentication successful, remember the username
          req.session.user = {
            username: username,
            password: password
          };
          response.on('data', function(chunk) {
            var json = JSON.parse(chunk);
            if (json.user === undefined) {
              console.log('did not find chunk.user');
            }
            res.status(200).send({
              authenticated: true,
              username: username,
              profile: json.user || {},
              guestAccess: options.guestAccess,
              readOnlyAccess: options.readOnlyAccess,
              appUsersOnly: options.appUsersOnly
            });
            req.session.user.profile = json.user || {};
          });
        } else {
          res.status(response.statusCode).send(response.statusMessage);
        }
      }

    });

    login.on('error', function(e) {
      console.log(JSON.stringify(e));
      console.log('login failed: ' + e.statusCode);
    });
  }
});

router.get('/user/logout', function(req, res) {
  noCache(res);
  delete req.session.user;
  res.send();
});

router.get('/*', four0four.notFoundMiddleware);

function noCache(response){
  response.append('Cache-Control', 'no-cache, must-revalidate');//HTTP 1.1 - must-revalidate
  response.append('Pragma', 'no-cache');//HTTP 1.0
  response.append('Expires', 'Sat, 26 Jul 1997 05:00:00 GMT'); // Date in the past
}

module.exports = router;
