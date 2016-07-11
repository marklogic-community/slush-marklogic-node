(function () {
  'use strict';

  angular.module('app', [
    'ml.common',
    'ml.search',
    'ml.search.tpls',
    'ml.utils',
    'ngJsonExplorer',
    'app.create',
    'app.detail',
    'app.error',
    'app.login',
    'app.root',
    'app.search',
    'app.user',
    'ui.bootstrap',
    'ui.router',
    'ui.tinymce',
    'cb.x2js',
    'ngToast',
    'uiGmapgoogle-maps',
    'ngMessages'
  ])
  .config(['uiGmapGoogleMapApiProvider', function(uiGmapGoogleMapApiProvider) {
    var libs = uiGmapGoogleMapApiProvider.options.libraries;
    if (libs === '') {
      libs = 'drawing';
    } else {
      libs = libs.split(',').push('drawing').join(',');
    }
    uiGmapGoogleMapApiProvider.configure({
      libraries: libs
    });
  }]);

}());
