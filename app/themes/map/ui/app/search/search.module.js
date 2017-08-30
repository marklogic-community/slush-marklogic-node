(function () {
  'use strict';

  angular.module('app.search', [
    // inject dependencies
    'app.map',
    'ml.search',

    // html dependencies
    'ml.search.tpls',
    'ui.bootstrap',
    'ui.router'
  ]);
}());
