(function () {

  'use strict';

  angular.module('sample.user')
    .directive('mlUser', [function () {
      return {
        restrict: 'EA',
        controller: 'UserController',
        replace: true,
        scope: {},
        templateUrl: '/user/user-dir.html'
      };
    }])
    .controller('UserController', ['$scope', 'User', function ($scope, user) {
      angular.extend($scope, {
        user: user,
        login: user.login,
        logout: function() {
          user.logout();
          $scope.password = '';
        }
      });
    }]);

}());
