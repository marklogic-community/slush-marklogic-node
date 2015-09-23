/*jshint node: true */

'use strict';

var router = require('express').Router();
var http = require('http');
var options = require('./utils/options')();
var auth = require('./utils/auth');

// ==================================
// MarkLogic REST API endpoints
// ==================================
// For any other GET request, proxy it on to MarkLogic.
router.get('*', auth.isAuthenticated, noCacheProxy);

router.put('*', auth.isAuthenticated, function(req, res) {
  noCache(res);
  // For PUT requests, require authentication
  if (req.path === '/v1/documents' &&
    req.query.uri.match('/api/users/') &&
    req.query.uri.match(new RegExp('/api/users/[^(' + req.session.user.name + ')]+.json'))) {
    // The user is try to PUT to a profile document other than his/her own. Not allowed.
    res.status(403).send('Forbidden');
  } else {
    if (req.path === '/v1/documents' && req.query.uri.match('/users/')) {
      // TODO: The user is updating the profile. Update the session info.
    }
    proxy(req, res);
  }
});

// Require authentication for POST requests
router.post('*', auth.isAuthenticated, noCacheProxy);

// (#176) Require authentication for DELETE requests
router.delete('*', auth.isAuthenticated, noCacheProxy);

function noCacheProxy(req, res){
  noCache(res);
  proxy(req, res);
}

// Generic proxy function used by multiple HTTP verbs
function proxy(req, res) {
  var queryString = req.originalUrl.split('?')[1];
  var path = '/v1' + req.path + (queryString ? '?' + queryString : '');
  console.log(
    req.method + ' ' + req.path + ' proxied to ' +
    options.mlHost + ':' + options.mlHttpPort + path);
  var mlReq = http.request({
    hostname: options.mlHost,
    port: options.mlHttpPort,
    method: req.method,
    path: path,
    headers: req.headers,
    auth: auth.getAuth(req)
  }, function(response) {

    res.statusCode = response.statusCode;

    // [GJo] (#67) forward all headers from MarkLogic
    for (var header in response.headers) {
      res.header(header, response.headers[header]);
    }

    response.on('data', function(chunk) {
      res.write(chunk);
    });
    response.on('end', function() {
      res.end();
    });
  });

  if (req.body !== undefined) {
    mlReq.write(JSON.stringify(req.body));
    mlReq.end();
  }

  mlReq.on('error', function(e) {
    console.log('Problem with request: ' + e.message);
  });
}

function noCache(response){
  response.append('Cache-Control', 'no-cache, must-revalidate');//HTTP 1.1 - must-revalidate
  response.append('Pragma', 'no-cache');//HTTP 1.0
  response.append('Expires', 'Sat, 26 Jul 1997 05:00:00 GMT'); // Date in the past
}

module.exports = router;
