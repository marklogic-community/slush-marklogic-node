/*jshint node:true*/
'use strict';
var gc = require('../../gulp.config')();

module.exports = function(){

  var options = {
    appPort: process.env.APP_PORT || gc.defaultPort,
    mlHost: process.env.ML_HOST || gc.marklogic.host,
    mlHttpPort: process.env.ML_PORT || gc.marklogic.httpPort,
    defaultUser: process.env.ML_APP_USER || gc.marklogic.user,
    defaultPass: process.env.ML_APP_PASS || gc.marklogic.password
  };

  return options;

};
