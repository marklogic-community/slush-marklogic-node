(function () {
  'use strict';

  angular.module('app.root', [
    // inject dependencies
    'app.login',
    'app.messageBoard',
    'app.navigation',
    'app.user',
    'ui.router',

    // child states
    'app.create',
    'app.detail',
    'app.landing',
    'app.search',
    'app.user'
  ]);
}());
