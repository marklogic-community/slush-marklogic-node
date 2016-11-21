(function () {
  'use strict';

  angular.module('app.search', [
    // inject dependencies
    'app.map',
    'ml.search',

    // html dependencies
    'app.snippet',
    'ml.search.tpls',
    'ui.bootstrap',
    'ui.router'
  ]);
}());
