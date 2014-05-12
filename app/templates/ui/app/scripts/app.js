
angular.module('sample', ['ngRoute', 'ngCkeditor', 'sample.user', 'sample.search', 'sample.common', 'ui.bootstrap'])
  .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

    'use strict';

    $locationProvider.html5Mode(true);

    $routeProvider
      .when('/', {
        templateUrl: '/search/search.html'
      })
      .when('/create', {
        templateUrl: '/views/create.html',
        controller: 'CreateCtrl'
      })
      .when('/detail', {
        templateUrl: '/views/demo.html',
        controller: 'DemoCtrl'
      })
      .when('/profile', {
        templateUrl: '/views/profile.html',
        controller: 'ProfileCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
