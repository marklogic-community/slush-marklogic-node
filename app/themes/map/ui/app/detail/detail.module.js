(function () {
  'use strict';

  angular.module('app.detail', [
    'app.similar',
    'ui.router',
    'app.root',
    'uiGmapgoogle-maps',
    'ml.common', // Using MLRest for delete
    'ngToast', // Showing a toast on delete
    'mwl.confirm' // for delete confirmation popups
  ]);
}());
