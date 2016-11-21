(function() {
  'use strict';

  angular.module('app.landing', [
    // inject dependencies
    'ml.search',
    'app.user',

    // html dependencies
    'app.dashboard',
    'ml.highcharts',
    'ui.bootstrap'
  ]);
}());
