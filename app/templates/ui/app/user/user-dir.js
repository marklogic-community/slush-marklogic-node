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
  .controller('UserController', ['$scope', 'User', 'MLRest', '$location', function ($scope, user, mlRest, $location) {
    angular.extend($scope, {
      login: function(username, password) {
        mlRest.login(username, password).then(function (result) {
          user.authenticated = result.authenticated;
          if (user.authenticated === true) {
            user.loginError = false;
            if (result.profile !== undefined) {
              user.fullname = result.profile.fullname;
              user.emails = result.profile.emails;
            } else {
              $location.path('/profile');
            }
          } else {
            user.loginError = true;
          }
        });
      },
      logout: function() {
        mlRest.logout().then(function() {
          user.init();
        });
      }

    });
  }]);
}());
