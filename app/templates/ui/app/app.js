(function () {
  'use strict';

  angular.module('app', [
    // routing
    'app.route',

    // http interceptors
    'app.error',
    'app.login',

    // top-level state
    'app.root'
  ]);

}());
