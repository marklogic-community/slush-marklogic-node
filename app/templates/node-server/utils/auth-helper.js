/*jshint node: true */

'use strict';

var options = require('./options')();
var https = require('https');
var http = require('http');
var q = require('q');
var wwwAuthenticate = require('www-authenticate');
/* jshint -W079 */
var _ = require('underscore');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var httpClient = http;
if (options.mlCertificate) {
  console.log('ML Certificate = "' + options.mlCertificate + '"');
  console.log('Will use https client.');
  httpClient = https;
} else {
  console.log('ML Certificate = "' + options.mlCertificate + '"');
  console.log('Will use http client.');
}

var defaultOptions = {
  authHost: options.mlHost,
  authPort: options.mlHttpPort,
  authUser: options.defaultUser,
  authPassword: options.defaultPass,
  challengeMethod: 'HEAD',
  challengePath: '/v1/ping'
};

function init() {
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  passport.use(new LocalStrategy({
      passReqToCallback: true
    },
    function(req, username, password, done) {
      var reqOptions = {
        hostname: options.mlHost,
        port: options.mlHttpPort,
        path: '/v1/documents?uri=/api/users/' + username + '.json',
        headers: {}
      };

      getAuthorization(req.session, reqOptions.method, reqOptions.path, {
        authHost: options.mlHost,
        authPort: options.mlHttpPort,
        authUser: username,
        authPassword: password
      }).then(function(authorization) {
        if (authorization) {
          reqOptions.headers.Authorization = authorization;
        }

        var login = httpClient.get(reqOptions, function(response) {

          var user = {
            authenticated: true,
            username: username
          };

          if (response.statusCode === 200) {
            response.on('data', function(chunk) {
              var json = JSON.parse(chunk);
              if (json.user !== undefined) {
                user.profile = json.user;
              } else {
                console.log('did not find chunk.user');
              }

              done(null, user);
            });
          } else if (response.statusCode === 404) {
            //no user profile yet..
            done(null, user);
          } else if (response.statusCode === 401) {
            clearAuthenticator(req.session);
            done(null, false, {
              message: 'Invalid credentials'
            });
          } else {
            done(null, false, {
              message: 'API error'
            });
          }
        });
        login.on('error', function(e) {
          console.log(JSON.stringify(e));
          console.log('login failed: ' + e.statusCode);
          done(e);
        });
      });
    }
  ));
}

function handleLocalAuth(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.json(401, {
        message: info.message
      });
    }

    // Manually establish the session...
    req.login(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.json(user);
    });

  })(req, res, next);
}

function isAuthenticated(req, res, next) {

  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(401).send('Unauthorized');
  }
}

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
  return authenticator.lastAccessed &&
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
  var authenticator = authenticators[authenticatorId];
  timestampAuthenticator(authenticator);
  return authenticator;
}

function getAuthorization(session, reqMethod, reqPath, authOptions) {
  reqMethod = reqMethod || 'GET';
  var authorization = null;
  var d = q.defer();
  var mergedOptions = _.extend({}, defaultOptions, authOptions || {});
  var authenticator = getAuthenticator(
    session,
    mergedOptions.authUser || options.defaultUser,
    mergedOptions.authHost,
    mergedOptions.authPort
  );
  if (authenticator) {
    authorization = authenticator.authorize(reqMethod, reqPath);
    d.resolve(authorization);
  } else {
    var challengeReq = httpClient.request({
      hostname: mergedOptions.authHost,
      port: mergedOptions.authPort,
      method: mergedOptions.challengeMethod,
      path: mergedOptions.challengePath
    }, function(response) {
      var statusCode = response.statusCode;
      var challenge = response.headers['www-authenticate'];
      var hasChallenge = (challenge !== null);
      if (statusCode === 401 && hasChallenge) {
        authenticator = createAuthenticator(
          session,
          mergedOptions.authHost,
          mergedOptions.authPort,
          mergedOptions.authUser || options.defaultUser,
          mergedOptions.authPassword || options.defaultPass,
          challenge
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
  init: init,
  isAuthenticated: isAuthenticated,
  handleLocalAuth: handleLocalAuth,
  getAuthorization: getAuthorization,
  clearAuthenticator: clearAuthenticator
};

module.exports = authHelper;
