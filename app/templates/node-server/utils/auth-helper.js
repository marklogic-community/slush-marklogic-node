/*jshint node: true */

'use strict';

var http = require('http');
var options = require('./options');
var q = require('q');
var wwwAuthenticate = require('www-authenticate');
/* jshint -W079 */
var _ = require('underscore');

var defaultOptions = {
  authHost: options.mlHost,
  authPort: options.mlHttpPort,
  authUser: options.defaultUser,
  authPassword: options.defaultPass,
  challengeMethod: 'HEAD',
  challengePath: '/v1/ping'
};

var authenticators = {};

setInterval(function() {
  for (var id in authenticators) {
    if (isExpired(authenticators[id])) {
      delete authenticators[id];
    }
  }
}, 1000 * 60 * 30);

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function clearAuthenticator(session) {
  if (session.authenticators) {
    for (var key in session.authenticators) {
      var authenticatorId = session.authenticators[key];
      delete authenticators[authenticatorId];
    }
  }
  delete session.authenticators;
}

function createAuthenticator(session, host, port, user, password, challenge) {
  var authenticator = wwwAuthenticate.call(null, user, password)(challenge);
  if (!session.authenticators) {
    session.authenticators = {};
  }
  var authenticatorId = session.authenticators[user + ':' + host + ':' + port];
  if (!authenticatorId) {
    authenticatorId = guid();
    session.authenticators[user + ':' + host + ':' + port] = authenticatorId;
  }

  authenticators[authenticatorId] = authenticator;
  timestampAuthenticator(authenticator);
  return authenticator;
}

function timestampAuthenticator(authenticator) {
  if (authenticator) {
    authenticator.lastAccessed = new Date();
  }
}

var expirationTime = 1000 * 60 * 60 * 12;

function isExpired(authenticator) {
  return
    authenticator.lastAccessed &&
    ((new Date()) - authenticator.lastAccessed) > expirationTime;
}

function getAuthenticator(session, user, host, port) {
  if (!session.authenticators) {
    return null;
  }
  var authenticatorId = session.authenticators[user + ':' + host + ':' + port];
  if (!authenticatorId) {
    return null;
  }
  console.log('Get auth: ' + user + ':' + host + ':' + port);
  var authenticator = authenticators[authenticatorId];
  timestampAuthenticator(authenticator);
  return authenticator;
}

function getAuthorization(session, reqMethod, reqPath, authOptions) {
  reqMethod = reqMethod || 'GET';
  var authorization = null;
  var d = q.defer();
  var mergedOptions = _.extend({}, defaultOptions, authOptions || {});
  var authenticator = getAuthenticator(session, mergedOptions.authUser, mergedOptions.authHost, mergedOptions.authPort);
  if (authenticator) {
    authorization = authenticator.authorize(reqMethod, reqPath);
    d.resolve(authorization);
  } else {
    var challengeReq = http.request({
      hostname: mergedOptions.authHost,
      port: mergedOptions.authPort,
      method: mergedOptions.challengeMethod,
      path: mergedOptions.challengePath
    }, function(response) {
      var statusCode = response.statusCode;
      var challenge = response.headers['www-authenticate'];
      var hasChallenge = (challenge != null);
      if (statusCode === 401 && hasChallenge) {
        authenticator = createAuthenticator(
          session, mergedOptions.authHost, mergedOptions.authPort, mergedOptions.authUser, mergedOptions.authPassword, challenge
        );
        authorization = authenticator.authorize(reqMethod, reqPath);
        d.resolve(authorization);
      } else {
        session.authenticators = {};
        d.reject();
      }
    });
    challengeReq.end();
  }
  return d.promise;
}

var authHelper = {
  getAuthorization: getAuthorization,
  clearAuthenticator: clearAuthenticator
};

module.exports = authHelper;
