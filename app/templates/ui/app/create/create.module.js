(function () {
  'use strict';

  angular.module('app.create', [
    // inject dependencies
    'cb.x2js',
    'ml.common',
    'ngToast',
    'ui.router',

    // html dependencies
    'mwl.confirm',
    'ngMessages',
    'ui.bootstrap',
    'ui.tinymce'
  ]);
}());
