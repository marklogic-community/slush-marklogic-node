/*jshint node: true */

'use strict';

var httpProxy = require('http-proxy');
var router = require('express').Router();
var url = require('url');

var authHelper = require('./utils/auth-helper');
var options = require('./utils/options')();
var fs = require('fs');

var ca = null;
if (options.mlCertificate) {
  console.log('Loading ML Certificate ' + options.mlCertificate);
  ca = fs.readFileSync(options.mlCertificate);
} else {
  console.log('No ML SSL Certificate.');
}

/************************************************/
/*************  setup proxy server  *************/
/************************************************/

// TODO: configurable path?
var target = {
  protocol: options.mlCertificate ? 'https' : 'http',
  hostname: options.mlHost,
  port: options.mlHttpPort,
  pathname: '/v1'
};

var proxyServer = httpProxy.createProxyServer({
  target: url.format(target),
  ca: options.mlCertificate ? ca : null,
  secure: options.httpsStrict
    //options.httpsStrict === false assumes that you are in dev mode
});

function getAuth(req) {
  var user = req.session.passport && req.session.passport.user &&
    req.session.passport.user.username;

  return authHelper.getAuthorization(req.session, req.method, target.pathname + req.path, {
    authUser: user
  });
}

function proxy(req, res) {
  getAuth(req).then(function(auth) {
    // TODO: if no auth?
    var headers = {
      headers: {
        authorization: auth
      }
    };

    // TODO: filter www-header in response?
    // (currently prompts without authed middleware)

    proxyServer.web(req, res, headers, function(e) {
      console.log(e);
      res.status(500).send('Error');
    });
  }, function(e) {
    console.log('auth error:');
    console.log(e);
    return res.status(401).send('Unauthorized');
  });
}

/************************************************/
/**********  create custom middleware  **********/
/************************************************/

function noCache(req, res, next) {
  res.append('Cache-Control', 'no-cache, must-revalidate'); // HTTP 1.1 - must-revalidate
  res.append('Pragma', 'no-cache'); // HTTP 1.0
  res.append('Expires', 'Sat, 26 Jul 1997 05:00:00 GMT'); // Date in the past

  next();
}

function authed(req, res, next) {
  if (!(options.guestAccess || req.isAuthenticated())) {
    return res.status(401).send('Unauthorized');
  }

  next();
}

function update(req, res, next) {
  if (options.disallowUpdates) {
    return res.status(403).send('Forbidden');
  }

  next();
}

function profile(req, res, next) {
  if ((req.path === '/documents') &&
    req.query.uri &&
    req.query.uri.match('/api/users/') &&
    !req.query.uri.match('/api/users/' + req.session.passport.user.username + '.json')) {
    return res.status(403).send('Forbidden');
  }

  next();
}

/************************************************/
/************  configure middleware  ************/
/************************************************/

// allow any, unauthed:
// router.use(proxy);

router.use(noCache);
router.use(authed);

/************************************************/
/**************  configure routes  **************/
/************************************************/

router.get('/config/query/*', proxy);

router.get('/graphs/sparql', proxy);

var search = router.route('/search');
search.get(proxy);
search.post(proxy);

var suggest = router.route('/suggest');
suggest.get(proxy);
suggest.post(proxy);

var values = router.route('/values/*');
values.get(proxy);
values.post(proxy);

var docs = router.route('/documents');
docs.get(proxy);
docs.all(update, profile, proxy);

var ext = router.route('/resources/*');
ext.get(proxy);
ext.all(update, proxy);

// Explicitly reject all other routes
router.all('*', function(req, res) {
  res.status(401).send('Not proxied');
});

module.exports = router;
