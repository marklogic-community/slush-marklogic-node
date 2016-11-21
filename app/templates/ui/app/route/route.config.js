(function () {
  'use strict';

  angular.module('app.route')
    .run(['loginService', function(loginService) {
      loginService.protectedRoutes(['root.search', 'root.create', 'root.profile']);
    }])
    .config(RouteConfig);

  RouteConfig.$inject = ['$stateProvider', '$urlMatcherFactoryProvider',
    '$urlRouterProvider', '$locationProvider'
  ];

  function RouteConfig(
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
        controller: 'RootCtrl',
        controllerAs: 'rootCtrl',
        resolve: {
          user: function(userService) {
            return userService.getUser();
          }
        }
      })
      .state('root.landing', {
        url: '/',
        templateUrl: 'app/landing/landing.html',
        controller: 'LandingCtrl',
        controllerAs: 'ctrl',
        navLabel: {
          text: 'Home',
          area: 'dashboard',
          navClass: 'fa-home'
        }
      })
      .state('root.search', {
        url: '/search',
        templateUrl: 'app/search/search.html',
        controller: 'SearchCtrl',
        controllerAs: 'ctrl',
        navLabel: {
          text: 'Search',
          area: 'dashboard',
          navClass: 'fa-search'
        }
      })
      .state('root.create', {
        url: '/create?prev',
        templateUrl: 'app/create/create.html',
        controller: 'CreateCtrl',
        controllerAs: 'ctrl',
        navLabel: {
          text: 'Create',
          area: 'dashboard',
          navClass: 'fa-wpforms',
          edit: true
        },
        resolve: {
          doc: function() {
            return null;
          }
        }
      })
      .state('root.edit', {
        url: '/edit{uri:path}?prev',
        templateUrl: 'app/create/create.html',
        controller: 'CreateCtrl',
        controllerAs: 'ctrl',
        resolve: {
          doc: function(MLRest, $stateParams) {
            var uri = $stateParams.uri;

            var format = 'json';
            if (uri.endsWith('.xml')) {
              format = 'xml';
            }

            return MLRest.getDocument(uri, { format: format }).then(function(response) {
              return response;
            });
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
        templateUrl: 'app/detail/detail.html',
        controller: 'DetailCtrl',
        controllerAs: 'ctrl',
        resolve: {
          doc: function(MLRest, $stateParams) {
            var uri = $stateParams.uri;
            return MLRest.getDocument(uri, { format: 'json' }).then(function(response) {
              return response;
            });
          }
        }
      })
      .state('root.profile', {
        url: '/profile',
        templateUrl: 'app/user/profile.html',
        controller: 'ProfileCtrl',
        controllerAs: 'ctrl'
      })
      .state('root.login', {
        url: '/login?state&params',
        templateUrl: 'app/login/login-full.html',
        controller: 'LoginFullCtrl',
        controllerAs: 'ctrl'
      });
  }
}());
