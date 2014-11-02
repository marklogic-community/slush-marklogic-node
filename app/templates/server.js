/*jshint node: true */
'use strict';
/*
 * @author Dave Cassel - https://github.com/dmcassel
 *
 * This file configures the publicly visible server-side endpoints of your application. Work in this file to allow
 * access to parts of the MarkLogic REST API or to configure your own application-specific endpoints.
 * This file also handles session authentication, with authentication checks done by attempting to access MarkLogic.
 */

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var http = require('http');
var path = require('path');
var appDir = path.join( __dirname + '/ui/app');
var assets = require('assets-middleware');
var less = require('less');
var conf = require('konphyg')(path.join( __dirname + '/ui/conf'));
var assetConfig = conf('assets');
var lessConfig = assetConfig.less || {};
var uglifyCss = require('uglifycss');
var uglifyJs = require('uglify-js');
var assetDest = assetConfig.dest ? path.join(appDir,assetConfig.dest) : path.join(appDir,'/assets');

function getAuth(options, session) {

  if (session.user !== undefined && session.user.name !== undefined) {
    return session.user.name + ':' + session.user.password;
  } else {
    return options.defaultUser + ':' + options.defaultPass;
  }
}

exports.buildExpress = function(options) {

  var express = require('express');
  var app = express();

  app.use(cookieParser());
  // Change this secret to something unique to your application
  app.use(session({
    secret: '1234567890QWERTY',
    saveUninitialized: true,
    resave: true
  }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  // Generic proxy function used by multiple HTTP verbs
  function proxy(req, res) {
    var queryString = req.originalUrl.split('?')[1];
    console.log(req.method + ' ' + req.path + ' proxied to ' + options.mlHost + ':' + options.mlPort + req.path + (queryString ? '?' + queryString : ''));
    var mlReq = http.request({
      hostname: options.mlHost,
      port: options.mlPort,
      method: req.method,
      path: req.path + (queryString ? '?' + queryString : ''),
      headers: req.headers,
      auth: getAuth(options, req.session)
    }, function(response) {
      // some requests (POST /v1/documents) return a location header. Make sure
      // that gets back to the client.
      if (response.headers.location) {
        res.header('location', response.headers.location);
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


  app.get('/user/status', function(req, res) {
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

  app.get('/user/login', function(req, res) {
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
      console.log('login failed: ' + e.statusCode);
    });
  });

  app.get('/user/logout', function(req, res) {
    delete req.session.user;
    res.send();
  });

  // ==================================
  // MarkLogic REST API endpoints
  // ==================================
  // For any other GET request, proxy it on to MarkLogic.
  app.get('/v1*', function(req, res) {
    proxy(req, res);

    // To require authentication before getting to see data, use this:
    // if (req.session.user === undefined) {
    //   res.send(401, 'Unauthorized');
    // } else {
    //   proxy(req, res);
    // }
    // -- end of requiring authentication

  });

  app.put('/v1*', function(req, res) {
    // For PUT requests, require authentication
    if (req.session.user === undefined) {
      res.send(401, 'Unauthorized');
    } else if (req.path === '/v1/documents' &&
      req.query.uri.match('/users/') &&
      req.query.uri.match(new RegExp('/users/[^(' + req.session.user.name + ')]+.json'))) {
      // The user is try to PUT to a profile document other than his/her own. Not allowed.
      res.send(403, 'Forbidden');
    } else {
      if (req.path === '/v1/documents' && req.query.uri.match('/users/')) {
        // TODO: The user is updating the profile. Update the session info.
      }
      proxy(req, res);
    }
  });

  // Require authentication for POST requests
  app.post('/v1*', function(req, res) {
    if (req.session.user === undefined) {
      res.send(401, 'Unauthorized');
    } else {
      proxy(req, res);
    }
  });

  // Require authentication for POST requests
  app.delete('/v1*', function(req, res) {
    if (req.session.user === undefined) {
      res.send(401, 'Unauthorized');
    } else {
      proxy(req, res);
    }
  });

  /** Tools for bundling assets **/

  var compileLess = function(content,next) {
    less.render(content, {
      paths: [ path.join(appDir, lessConfig.importPath || '/styles') ],
      compress: lessConfig.compress
    }, next);
  };

  var processCss = function(content,file, next) {
    switch (file.extname) {
      case '.less':  compileLess(content,next); break;
      default: next(null,content);
    }
  };

  var minifyCss = function(content,next) {
    try {
      next(null, uglifyCss.processString(content));
    } catch(e) {
      next(e);
    }
  };
  var minifyJs = function(content,next) {
    try {
      console.log('minifying js');
      var result = uglifyJs.minify(content, { fromString: true });
      console.log('uglified',result.code);
      next(null, result.code);
    } catch(e) {
      next(e);
    }
  };

  // our app.css is a less file
  app.get('/assets/main.css', assets({
    force: assetConfig.force,
    dest: path.join(assetDest,'/main.css'),
    src: [ path.join(appDir, '/styles/main.less') ],
    pipeline: {
      prefilter: ['less','css'],
      mapContent: function(content,file,next) {
        processCss(content,file,next);
      }
    }
  }));

  // our plugins.css is a combination of files
  app.get('/assets/plugins.css', assets({
    force: assetConfig.force,
    dest: path.join(assetDest,'/plugins.css'),
    src: [
      path.join(appDir, '/bower_components/ng-json-explorer/src/gd-ui-jsonexplorer.css'),
      path.join(appDir, '/bower_components/highlightjs/styles/default.css')
    ],
    pipeline: {
      prefilter: ['less','css'],
      mapContent: function(content,file,next) {
        processCss(content,file,next);
      },
      postReduceContent: function(content,next) {
        minifyCss(content,next);
      }
    }
  }));

  app.get('/assets/main.js', assets({
    force: assetConfig.force,
    dest: path.join(assetDest,'/main.js'),
    src: [
      path.join(appDir, '/app.js'),
      path.join(appDir, '/search/search.js'),
      path.join(appDir, '/search/search-ctrl.js'),
      path.join(appDir, '/search/facets-dir.js'),
      path.join(appDir, '/search/results-dir.js'),
      path.join(appDir, '/detail/detail.js'),
      path.join(appDir, '/detail/detail-ctrl.js'),
      path.join(appDir, '/user/user.js'),
      path.join(appDir, '/user/user-dir.js'),
      path.join(appDir, '/user/user-srv.js'),
      path.join(appDir, '/user/profile.js'),
      path.join(appDir, '/create/create.js'),
      path.join(appDir, '/create/create-ctrl.js'),
      path.join(appDir, '/create/compile.js'),
      path.join(appDir, '/common/common.js'),
      path.join(appDir, '/common/services/mlrest.js')
    ],
    pipeline: {
      prefilter: ['js'],
      mapContent: function(c,f,next) { next(null,c); },
      postReduceContent: function(content, next) {
        if (assetConfig.js.minify) {
          minifyJs(content,next);
        } else {
          next(null,content);
        }
      }
    }
  }));

  // this bundle is large so we cache it and don't minify it - use minified libraries if you want a minified bundle
  // NOTE:  restart the express server if any files in this bundled are modified
  // TODO:  could move this into the app.json config so that minified files could be used in app.production.json and non-minified files everywhere else
  app.get('/assets/plugins.js', assets({
    force: false,
    dest: path.join(assetDest,'/plugins.js'),
    src: [
      path.join(appDir, '/bower_components/jquery/jquery.js'),
      path.join(appDir, '/bower_components/angular/angular.js'),
      path.join(appDir, '/bower_components/angular-route/angular-route.js'),
      path.join(appDir, '/bower_components/angular-cookies/angular-cookies.js'),
      path.join(appDir, '/bower_components/ckeditor/ckeditor.js'),
      path.join(appDir, '/bower_components/ng-ckeditor/ng-ckeditor.js'),
      path.join(appDir, '/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js'),
      path.join(appDir, '/bower_components/ng-json-explorer/src/gd-ui-jsonexplorer.js'),
      path.join(appDir, '/bower_components/angular-highlightjs/angular-highlightjs.js'),
      path.join(appDir, '/bower_components/highlightjs/highlight.pack.js')
    ]
  }));

  app.use(express.static('ui/app'));
  app.use('/', express.static('ui/app'));
  // for paths that should be handled by AngularJS, add a line here similar to /profile.
  app.use('/profile', express.static('ui/app'));
  app.use('/detail', express.static('ui/app'));
  app.use('/create', express.static('ui/app'));

  return app;
};

