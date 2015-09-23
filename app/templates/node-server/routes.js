/*jshint node: true */

'use strict';

var router = require('express').Router();
var four0four = require('./utils/404')();
var http = require('http');
var options = require('./utils/options')();
var auth = require('./utils/auth');

auth.init();

router.post('/user/login', auth.handleLocalAuth);

router.get('/user/status', function(req, res) {
  var headers = req.headers;
  noCache(res);

  if (!req.isAuthenticated()) {
    res.send({authenticated: false});
  } else {
    var passportUser = req.session.passport.user;
    delete headers['content-length'];
    var status = http.get({
      hostname: options.mlHost,
      port: options.mlHttpPort,
      path: '/v1/documents?uri=/api/users/' + passportUser.username + '.json',
      headers: headers,
      auth: passportUser.username + ':' + passportUser.password
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
  }
});

router.get('/user/logout', function(req, res) {
  noCache(res);
  req.logout();
  res.send();
});

router.get('/*', four0four.notFoundMiddleware);

function noCache(response){
  response.append('Cache-Control', 'no-cache, must-revalidate');//HTTP 1.1 - must-revalidate
  response.append('Pragma', 'no-cache');//HTTP 1.0
  response.append('Expires', 'Sat, 26 Jul 1997 05:00:00 GMT'); // Date in the past
}

module.exports = router;
