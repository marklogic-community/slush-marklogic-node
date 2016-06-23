(function() {
  'use strict';

  angular.module('app')
    .run(['loginService',
      function(loginService) {
        loginService.protectedRoutes(['root.search', 'root.create', 'root.profile']);
      }
    ])
    .config(Config);

  Config.$inject = ['$stateProvider', '$urlMatcherFactoryProvider',
    '$urlRouterProvider', '$locationProvider'
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
        component: 'root',
        resolve: {
          user: function(userService) {
            return userService.getUser();
          }
        }
      })
      .state('root.landing', {
        url: '/',
        templateUrl: 'app/landing/landing.html',
        navLabel: {
          text: 'Home',
          area: 'dashboard',
          navClass: 'fa-home'
        }
      })
      .state('root.search', {
        url: '/search',
        component: 'search',
        navLabel: {
          text: 'Search',
          area: 'dashboard',
          navClass: 'fa-search'
        }
      })
      .state('root.create', {
        url: '/create',
        component: 'create',
        navLabel: {
          text: 'Create',
          area: 'dashboard',
          navClass: 'fa-wpforms',
          edit: true
        },
        resolve: {
          stuff: function() {
            return null;
          }
        }
      })
      .state('root.view', {
        url: '/detail{uri:path}',
        params: {
          uri: {
            value: null
          }
        },
        component: 'detail',
        resolve: {
          doc: function(MLRest, $stateParams) {
            var uri = $stateParams.uri;
            return MLRest.getDocument(uri, {
              format: 'json'
            }).then(function(response) {
              return response;
            });
          }
        }
      })
      .state('root.profile', {
        url: '/profile',
        component: 'profile'
      })
      .state('root.login', {
        url: '/login?state&params',
        component: 'loginFull'
      });
  }
}());
