(function () {
  'use strict';

  angular.module('app.map', [
    // inject dependencies
    'uiGmapgoogle-maps'
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
