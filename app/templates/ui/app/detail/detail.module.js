(function () {
  'use strict';

  angular.module('app.detail', [
    'app.similar',
    'ui.router',
    'ml.common', // unit test fails without this
    'ngToast', // unit test fails without this
    'ui.bootstrap' // unit test fails without this
  ]);
}());
