(function () {
  'use strict';

  angular.module('app.login', [
    // inject dependencies
    'app.login', // for loginInterceptor
    'app.messageBoard',
    'app.user', // for loginInterceptor
    'ml.common',
    'ui.bootstrap',
    'ui.router'
  ]);
}());
