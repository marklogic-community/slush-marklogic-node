/*jshint node: true */

'use strict';

var router = require('express').Router();
var four0four = require('./utils/404')();
var http = require('http');

var options = {
  appPort: process.env.APP_PORT || 9070,
  mlHost: process.env.ML_HOST || 'localhost',
  mlPort: process.env.ML_PORT || '8040',
  defaultUser: 'admin',
  defaultPass: 'admin'
};

router.get('/user/status', function(req, res) {
  if (req.session.user === undefined) {
    res.send('{"authenticated": false}');
  } else {
    res.send({
      authenticated: true,
      username: req.session.user.name,
      profile: req.session.user.profile
    });
  }
});

router.get('/user/login', function(req, res) {
  // Attempt to read the user's profile, then check the response code.
  // 404 - valid credentials, but no profile yet
  // 401 - bad credentials
  var login = http.get({
    hostname: options.mlHost,
    port: options.mlPort,
    path: '/v1/documents?uri=/users/' + req.query.username + '.json',
    headers: req.headers,
    auth: req.query.username + ':' + req.query.password
  }, function(response) {
    if (response.statusCode === 401) {
      res.statusCode = 401;
      res.send('Unauthenticated');
    } else if (response.statusCode === 404) {
      // authentication successful, but no profile defined
      req.session.user = {
        name: req.query.username,
        password: req.query.password
      };
      res.send(200, {
        authenticated: true,
        username: req.query.username
      });
    } else {
      console.log('code: ' + response.statusCode);
      if (response.statusCode === 200) {
        // authentication successful, remember the username
        req.session.user = {
          name: req.query.username,
          password: req.query.password
        };
        response.on('data', function(chunk) {
          var json = JSON.parse(chunk);
          if (json.user !== undefined) {
            req.session.user.profile = {
              fullname: json.user.fullname,
              emails: json.user.emails
            };
            res.send(200, {
              authenticated: true,
              username: req.query.username,
              profile: req.session.user.profile
            });
          } else {
            console.log('did not find chunk.user');
          }
        });
      }
    }
  });

  login.on('error', function(e) {
    console.log(JSON.stringify(e));
    console.log('login failed: ' + e.statusCode);
  });
});

router.get('/user/logout', function(req, res) {
  delete req.session.user;
  res.send();
});

router.get('/*', four0four.notFoundMiddleware);

module.exports = router;
