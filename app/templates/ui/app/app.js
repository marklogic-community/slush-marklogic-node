(function () {
  'use strict';

  angular.module('sample', [
    'ml.common',
    'ml.search',
    'ml.search.tpls',
    'ml.utils',
    'ngJsonExplorer',
    'sample.create',
    'sample.detail',
    'sample.esriMap',
    'sample.search',
    'sample.templates',
    'sample.user',
    'ui.bootstrap',
    'ui.router',
    'ui.tinymce'
  ])
    .config(Config);

  Config.$inject = [
    '$stateProvider',
    '$urlMatcherFactoryProvider',
    '$urlRouterProvider',
    '$locationProvider'
  ];

  function Config(
    $stateProvider,
    $urlMatcherFactoryProvider,
    $urlRouterProvider,
    $locationProvider) {

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);

    function valToFromString(val) {
      return val !== null ? val.toString() : val;
    }

    function regexpMatches(val) { // jshint validthis:true
      return this.pattern.test(val);
    }

    $urlMatcherFactoryProvider.type('path', {
      encode: valToFromString,
      decode: valToFromString,
      is: regexpMatches,
      pattern: /.+/
    });

    $stateProvider
      .state('root', {
        url: '',
        // abstract: true,
        templateUrl: 'app/root/root.html',
        resolve: {
          user: function(userService) {
            return userService.getUser();
          }
        }
      })
      .state('root.landing', {
        url: '/',
        templateUrl: 'app/landing/landing.html'
      })
      .state('root.search', {
        url: '/search',
        templateUrl: 'app/search/search.html',
        controller: 'SearchCtrl',
        controllerAs: 'ctrl'
      })
      .state('root.create', {
        url: '/create',
        templateUrl: 'app/create/create.html',
        controller: 'CreateCtrl',
        controllerAs: 'ctrl',
        resolve: {
          stuff: function() {
            console.log('root.create');
            return null;
          }
        }
      })
      .state('root.view', {
        url: '/detail{uri:path}',
        params: {
          uri: {
            squash: true,
            value: null
          }
        },
        templateUrl: 'app/detail/detail.html',
        controller: 'DetailCtrl',
        controllerAs: 'ctrl',
        resolve: {
          doc: function(MLRest, $stateParams) {
            var uri = $stateParams.uri;
            return MLRest.getDocument(uri, { format: 'json' }).then(function(response) {
              return response.data;
            });
          }
        }
      })
      .state('root.profile', {
        url: '/profile',
        templateUrl: 'app/user/profile.html',
        controller: 'ProfileCtrl',
        controllerAs: 'ctrl'
      });
  }
}());
