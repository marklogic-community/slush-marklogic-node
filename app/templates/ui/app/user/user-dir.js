(function () {

  'use strict';

  var module = angular.module('sample.user');

  module.directive('mlUser', [function () {
    return {
      restrict: 'A',
      controller: 'UserController',
      replace: true,
      scope: {
        username: '=username',
        password: '=password',
        authenticated: '=authenticated',
        login: '&login',
        logout: '&logout',
        loginerror: '=loginerror'
      },
      templateUrl: '/user/user-dir.html',
      link: function($scope) {

      }
    };
  }])
  .controller('UserController', ['$scope', 'User', '$http', '$location', function ($scope, user, $http, $location) {
    angular.extend($scope, {
      login: function(username, password) {
        $http.get(
          '/user/login',
          {
            params: {
              'username': username,
              'password': password
            }
          }).then(function (result) {
            user.authenticated = result.data.authenticated;
            if (user.authenticated === true) {
              user.loginError = false;
              if (result.data.profile !== undefined) {
                user.fullname = result.data.profile.fullname;
                user.emails = result.data.profile.emails;
              } else {
                $location.path('/profile');
              }
            } else {
              user.loginError = true;
            }
          });
      },
      logout: function() {
        $http.get(
          '/user/logout',
          {}).then(function() {
            user.init();
          });
      }

    });
  }]);
}());
