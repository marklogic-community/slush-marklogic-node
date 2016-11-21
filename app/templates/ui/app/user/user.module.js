(function () {
  'use strict';

  angular.module('app.user', [
    // profile inject dependencies
    'ui.router',
    'ml.common',
    'ngToast',

    // (ml-)user inject dependencies
    'app.login',

    // profile/ml-user html dependencies
    'ui.bootstrap' // for glyphicons
  ]);
}());
