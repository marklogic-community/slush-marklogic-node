(function () {
  'use strict';

  angular.module('app.search', [
    // inject dependencies
    'ml.search',

    // html dependencies
    'app.snippet',
    'ml.search.tpls',
    'ui.bootstrap',
    'ui.router'
  ]);
}());
