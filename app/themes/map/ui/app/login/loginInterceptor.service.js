(function() {
  'use strict';

  angular.module('app.login')
    .factory('authInterceptor', AuthInterceptor)
    .config(['$httpProvider', function($httpProvider) {
      $httpProvider.interceptors.push('authInterceptor');
    }]);

  AuthInterceptor.$inject = ['$q', '$rootScope', '$injector'];
  function AuthInterceptor($q, $rootScope, $injector) {
    var waitingForLoginDefer;
    var waitingLineForLoginDefer = 0;
    function reduceWaitingLine() {
      waitingLineForLoginDefer--;
      if (waitingLineForLoginDefer <= 0) {
        waitingForLoginDefer = null;
      }
    }
    $rootScope.$on('$stateChangeSuccess', function() {
      waitingLineForLoginDefer = 0;
      waitingForLoginDefer = null;
    });

    var authInterceptor = {
      request: function(config) {
        if (/\/v1\//.test(config.url) && waitingForLoginDefer) {
          // hold off on additional REST API calls until login is resolved
          waitingLineForLoginDefer++;
          return waitingForLoginDefer.promise.then(function() {
            reduceWaitingLine();
            return config;
          },
          function() {
            reduceWaitingLine();
          });
        }
        return config;
      },
      responseError: function(rejection) {
        // Not logged in or session has expired
        var userService = $injector.get('userService');
        if (rejection.status === 419 || rejection.status === 401 &&
          !waitingForLoginDefer && !userService.currentUser() &&
          !/\/api\/user\/login/.test(rejection.config.url)) {
          var loginService = $injector.get('loginService');
          var $http = $injector.get('$http');
          waitingForLoginDefer = $q.defer();
          waitingLineForLoginDefer = 1;

          // We use login method that logs the user in using the current credentials and
          // returns a promise
          loginService.loginPrompt().then(
            waitingForLoginDefer.resolve, waitingForLoginDefer.reject);
          // When the session recovered, make the same backend call again and chain the request
          return waitingForLoginDefer.promise.then(function() {
            reduceWaitingLine();
            return $http(rejection.config);
          },
          function() {
            reduceWaitingLine();
          });
        }
        return $q.reject(rejection);
      }
    };
    return authInterceptor;
  }
}());
