(function () {
  'use strict';

  angular.module('app.detail', [
    'app.similar',
    'ui.router',
    'ml.common', // Using MLRest for delete
    'ngToast', // Showing toast on delete
    'mwl.confirm' // for delete confirmation popups
  ]);
}());
