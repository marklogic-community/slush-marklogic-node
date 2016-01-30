/* jshint node:true */

'use strict';

var config = require('../../gulp.config')();

module.exports = function(){

  var environment = process.env.NODE_ENV;
  var envJson = getEnvOptions(environment === 'build' ? 'prod' : 'local');

  var options = {
    appPort: process.env.APP_PORT || envJson['node-port'] || config.defaultPort,
    mlHost: process.env.ML_HOST || envJson['ml-host'] || config.marklogic.host,
    mlHttpPort: process.env.ML_PORT || envJson['ml-http-port'] || config.marklogic.httpPort,
    defaultUser: process.env.ML_APP_USER || envJson['ml-app-user'] || config.marklogic.user,
    defaultPass: process.env.ML_APP_PASS || envJson['ml-app-pass'] || config.marklogic.password
  };

  return options;

  function getEnvOptions(env) {
    var envJson;
    var envFile = '../../' + env + '.json';

    try {
      envJson = require(envFile);
    }
    catch (e) {
      envJson = {};
      console.log('Couldn\'t find ' + envFile + '; you can create this file to override properties - ' +
        '`gulp init-local` creates local.json which can be modified for other environments as well');
    }

    return envJson;
  }

};