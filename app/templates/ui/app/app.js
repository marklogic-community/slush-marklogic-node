
angular.module('sample', [
  'ngRoute', 'ngCkeditor', 'sample.user', 'sample.search', 'sample.common', 'sample.detail',
  'ui.bootstrap', 'gd.ui.jsonexplorer', 'sample.create'
])
  .constant('appConfig', { statelessSearch: false })
  .config(['$routeProvider', '$locationProvider', 'appConfig', function ($routeProvider, $locationProvider, appConfig) {

    'use strict';

    $locationProvider.html5Mode(true);

    $routeProvider
      .when('/', {
        templateUrl: '/search/search.html',
        controller: 'SearchCtrl',
        reloadOnSearch: !appConfig.statelessSearch
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
