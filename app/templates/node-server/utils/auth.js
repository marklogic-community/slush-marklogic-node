/*jshint node:true*/
'use strict';
var options = require('./options')();
var http = require('http');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

function init() {
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  passport.use(new LocalStrategy(
    function(username, password, done) {
      var login = http.get({
        hostname: options.mlHost,
        port: options.mlHttpPort,
        path: '/v1/documents?uri=/api/users/' + username + '.json',
        auth: username + ':' + password
      }, function(response) {

        var user = {
              authenticated:true,
              username:username,
              password:password //BAD!! but no other way yet..
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
          done(null, false, {message: 'Invalid credentials'});
        } else {
          done(null, false, {message: 'API error'});
        }
      });
      login.on('error', function(e) {
        console.log(JSON.stringify(e));
        console.log('login failed: ' + e.statusCode);
        done(e);
      });
    }
  ));
}

function handleLocalAuth(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) {
            return res.json(401, {
                message: info.message
            });
        }

        // Manually establish the session...
        req.login(user, function(err) {
            if (err) { return next(err); }
            return res.json(user);
        });

  })(req, res, next);
}

function isAuthenticated(req, res, next) {

  if (req.isAuthenticated()){
    return next();
  }
  else {
    res.status(401).send('Unauthorized');
  }
}

//by default force auth .... wonky
function getAuth(session) {
  var auth = null;
  if (session.user !== undefined && session.user.name !== undefined) {
    auth =  session.user.name + ':' + session.user.password;
  }
  else {
    auth = options.defaultUser + ':' + options.defaultPass;
  }

  return auth;
}

module.exports = {
  init: init,
  isAuthenticated: isAuthenticated,
  getAuth: getAuth,
  handleLocalAuth: handleLocalAuth
};
