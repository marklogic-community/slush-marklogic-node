
angular.module('sample', [
  'ngRoute',
  'ngCkeditor',
  'ui.bootstrap',
  'ngJsonExplorer',
  'ml.common',
  'ml.search',
  'ml.search.tpls',
  'ml.utils',
  'uiGmapgoogle-maps',
  'sample.searchInput',
  'sample.user',
  'sample.search',
  'sample.common',
  'sample.detail',
  'sample.detailMap',
  'sample.searchMap',
  'sample.create'
])
  .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

    'use strict';

    $locationProvider.html5Mode(true);

    $routeProvider
      .when('/', {
        templateUrl: '/search/search.html',
        controller: 'SearchCtrl',
        reloadOnSearch: false
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
      .when('/map', {
        templateUrl: '/search-map/search-map.html',
        controller: 'SearchMapCtrl',
        reloadOnSearch: false
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
