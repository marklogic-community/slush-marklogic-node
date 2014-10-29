
angular.module('sample', [
  'ngRoute', 'ngCkeditor', 'sample.user', 'sample.search', 'sample.common', 'sample.detail',
  'ui.bootstrap', 'gd.ui.jsonexplorer', 'sample.create', 'ml.utils'
])
  .config(['$routeProvider', '$locationProvider', 'mlMapsProvider', function ($routeProvider, $locationProvider, mlMapsProvider) {

    'use strict';

    // to use google maps, version 3, with the drawing and visualization libraries
    // mlMapsProvider.useVersion(3);
    // mlMapsProvider.addLibrary('drawing');
    // mlMapsProvider.addLibrary('visualization');

    $locationProvider.html5Mode(true);

    $routeProvider
      .when('/', {
        templateUrl: '/search/search.html'
      })
      .when('/create', {
        templateUrl: '/create/create.html',
        controller: 'CreateCtrl'
      })
      .when('/detail', {
        templateUrl: '/detail/detail.html',
        controller: 'DetailCtrl'
      })
      .when('/profile', {
        templateUrl: '/user/profile.html',
        controller: 'ProfileCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
