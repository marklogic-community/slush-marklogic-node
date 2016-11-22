/*jshint node: true */

'use strict';

var router = require('express').Router();
var authHelper = require('./utils/auth-helper');
var http = require('http');
var options = require('./utils/options')();

// ==================================
// MarkLogic REST API endpoints
// ==================================

//
// To not require authentication for a specific route, simply use the route below.
// Copy and change according to your needs.
//
//router.get('/my/route', function(req, res) {
//  noCache(res);
//  proxy(req, res);
//});

// For any other GET request, proxy it on to MarkLogic.
router.get('*', function(req, res) {
  noCache(res);
  if (!(options.guestAccess || req.isAuthenticated())) {
    res.status(401).send('Unauthorized');
  } else {
    proxy(req, res);
  }
});

// PUT requires special treatment, as a user could be trying to PUT a profile update..
router.put('*', function(req, res) {
  noCache(res);
  // For PUT requests, require authentication
  if (!req.isAuthenticated()) {
    res.status(401).send('Unauthorized');
  } else if (options.disallowUpdates || ((req.path === '/documents') &&
    req.query.uri &&
    req.query.uri.match('/api/users/') &&
    !req.query.uri.match('/api/users/' + req.session.passport.user.username + '.json'))) {
    // The user is trying to PUT to a profile document other than his/her own. Not allowed.
    res.status(403).send('Forbidden');
  } else {
    // proxy original request
    proxy(req, res);
  }
});

// Require authentication for POST requests
router.post(/^\/(alert\/match|search|suggest|values\/.*)$/, function(req, res) {
  noCache(res);
  if (!(options.guestAccess || req.isAuthenticated())) {
    res.status(401).send('Unauthorized');
  } else {
    proxy(req, res);
  }
});

router.post('*', function(req, res) {
  noCache(res);
  if (!req.isAuthenticated()) {
    res.status(401).send('Unauthorized');
  } else if (options.disallowUpdates) {
    res.status(403).send('Forbidden');
  } else {
    proxy(req, res);
  }
});

// (#176) Require authentication for DELETE requests
router.delete('*', function(req, res) {
  noCache(res);
  if (!req.isAuthenticated()) {
    res.status(401).send('Unauthorized');
  } else if (options.disallowUpdates) {
    res.status(403).send('Forbidden');
  } else {
    proxy(req, res);
  }
});

// Generic proxy function used by multiple HTTP verbs
function proxy(req, res) {
  var queryString = req.originalUrl.split('?')[1];
  var path = req.baseUrl + req.path + (queryString ? '?' + queryString : '');
  console.log(
    req.method + ' ' + req.path + ' proxied to ' +
    options.mlHost + ':' + options.mlHttpPort + path);
  var reqOptions = {
      hostname: options.mlHost,
      port: options.mlHttpPort,
      method: req.method,
      path: path,
      headers: req.headers
    };

  var passportUser = req.session.passport && req.session.passport.user;
  authHelper.getAuthorization(req.session, reqOptions.method, reqOptions.path,
    {
      authUser: passportUser && passportUser.username
    }
  ).then(
    function(authorization) {
      if (authorization) {
        reqOptions.headers.Authorization = authorization;
      }
      var mlReq = http.request(reqOptions, function(response) {

        res.statusCode = response.statusCode;

        // [GJo] (#67) forward all headers from MarkLogic
        for (var header in response.headers) {
          if (!/^WWW\-Authenticate$/i.test(header)) {
            res.header(header, response.headers[header]);
          }
        }

        response.on('data', function(chunk) {
          res.write(chunk);
        });
        response.on('end', function() {
          res.end();
        });
      });

      req.pipe(mlReq);
      req.on('end', function() {
        mlReq.end();
      });

      mlReq.on('socket', function (socket) {
        socket.on('timeout', function() {
          console.log('Timeout reached, aborting call to ML..');
          mlReq.abort();
        });
      });

      mlReq.on('error', function(e) {
        console.log('Proxying failed: ' + e.message);
        res.status(500).end();
      });
    });
}

function noCache(response) {
  response.append('Cache-Control', 'no-cache, must-revalidate');     // HTTP 1.1 - must-revalidate
  response.append('Pragma',        'no-cache');                      // HTTP 1.0
  response.append('Expires',       'Sat, 26 Jul 1997 05:00:00 GMT'); // Date in the past
}

module.exports = router;
