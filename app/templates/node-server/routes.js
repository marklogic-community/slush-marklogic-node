/*jshint node: true */

'use strict';

var router = require('express').Router();
var bodyParser = require('body-parser');
var four0four = require('./utils/404')();
var http = require('http');
var config = require('../gulp.config')();

var options = {
  appPort: process.env.APP_PORT || config.defaultPort,
  mlHost: process.env.ML_HOST || config.marklogic.host,
  mlHttpPort: process.env.ML_PORT || config.marklogic.httpPort,
  defaultUser: process.env.ML_APP_USER || config.marklogic.user,
  defaultPass: process.env.ML_APP_PASS || config.marklogic.password
};

// [GJo] (#31) Moved bodyParsing inside routing, otherwise it might try to parse uploaded binaries as json..
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/user/status', function(req, res) {
  var headers = req.headers;
  noCache(res);

  if (req.session.user === undefined) {
    res.send({ authenticated: false });
  } else {
    delete headers['content-length'];

    var username = req.session.user.name;
    var password = req.session.user.password;

    var status = http.get({
      hostname: options.mlHost,
      port: options.mlHttpPort,
      path: '/v1/documents?uri=/users/' + username + '.json',
      headers: headers,
      auth: username + ':' + password
    }, function(response) {
    console.log('login response : ' + response);
    if (response.statusCode === 401) {
      res.statusCode = 401;
      res.send('Unauthenticated');
    } else if (response.statusCode === 404) {
      // authentication successful, but no profile defined
      req.session.user = {
        name: username,
        password: password
      };
      res.status(200).send({
        authenticated: true,
        username: username
      });
    } else {
      console.log('code: ' + response.statusCode);
      if (response.statusCode === 200) {
        // authentication successful, remember the username
        req.session.user = {
          name: username,
          password: password
        };
        response.on('data', function(chunk) {
          console.log('chunk: ' + chunk);

          var json = JSON.parse(chunk);
          req.session.user.profile = {};

          if (json.user !== undefined) {
            req.session.user.profile.fullname = json.user.fullname;
            req.session.user.profile.emails = json.user.emails;
          }
          req.session.user.profile.webroles = json.webroles;

          if (json.user !== undefined) {
            res.status(200).send({
              authenticated: true,
              username: username,
              profile: json.user
            });
          } else {
            console.log('did not find chunk.user');
          }
        });
      } else {
        res.statusCode = response.statusCode;
        res.send(response.statusMessage);
      }
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
  var username = req.body.username;
  var password = req.body.password;
  var headers = req.headers;
  //make sure login isn't cached
  noCache(res);

  // remove content length so ML doesn't wait for request body
  // that isn't being passed.
  delete headers['content-length'];
  var login = http.request({
    method: 'POST',
    hostname: options.mlHost,
    port: options.mlHttpPort,
    // path: '/v1/documents?uri=/api/users/' + username + '.json',
    path: '/v1/resources/profile',
    // headers: headers,
    auth: username + ':' + password
  }, function(response) {
    console.log('login response : ' + response);
    if (response.statusCode === 401) {
      res.statusCode = 401;
      res.send('Unauthenticated');
    } else if (response.statusCode === 404) {
      // authentication successful, but no profile defined
      req.session.user = {
        name: username,
        password: password
      };
      res.status(200).send({
        authenticated: true,
        username: username
      });
    } else {
      console.log('code: ' + response.statusCode);
      if (response.statusCode === 200) {
        // authentication successful, remember the username
        req.session.user = {
          name: username,
          password: password
        };
        response.on('data', function(chunk) {
          console.log('chunk: ' + chunk);

          var json = JSON.parse(chunk);
          req.session.user.profile = {};

          if (json.user !== undefined) {
            req.session.user.profile.fullname = json.user.fullname;
            req.session.user.profile.emails = json.user.emails;
          }
          req.session.user.profile.webroles = json.webroles;

          if (json.user !== undefined) {
            res.status(200).send({
              authenticated: true,
              username: username,
              profile: json.user
            });
          } else {
            console.log('did not find chunk.user');
          }
        });
      } else {
        res.statusCode = response.statusCode;
        res.send(response.statusMessage);
      }
    }
  });

  login.end();

  login.on('socket', function(socket) {
    socket.setTimeout(10000);
    socket.on('timeout', function() {
      console.log('timeout..');
      login.abort();
    });
  });

  login.on('error', function(e) {
    console.log('login failed: ' + e);
    login.abort();
    res.status(500).send('Login failed');
  });
});

router.get('/user/logout', function(req, res) {
  noCache(res);
  delete req.session.user;
  res.send();
});

router.get('/*', four0four.notFoundMiddleware);

function noCache(response) {
  response.append('Cache-Control', 'no-cache, must-revalidate'); //HTTP 1.1 - must-revalidate
  response.append('Pragma', 'no-cache'); //HTTP 1.0
  response.append('Expires', 'Sat, 26 Jul 1997 05:00:00 GMT'); // Date in the past
}

module.exports = router;
