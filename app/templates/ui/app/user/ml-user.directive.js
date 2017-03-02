(function () {

  'use strict';

  angular.module('app.user')
    .directive('mlUser', UserDirective)
    .controller('UserCtrl', UserCtrl);

  function UserDirective() {
    return {
      restrict: 'EA',
      controller: 'UserCtrl',
      controllerAs: '$ctrl',
      replace: true,
      scope: {
        showCancel: '=',
        mode: '@',
        callback: '&'
      },
      templateUrl: 'app/user/ml-user.html'
    };
  }

  UserCtrl.$inject = ['$scope', 'userService', 'loginService'];

  function UserCtrl($scope, userService, loginService) {
    var ctrl = this;
    angular.extend(ctrl, {
      username: null,
      password: null,
      loginService: loginService
    });
    $scope.$watch(userService.currentUser, function(newValue) {
      $scope.currentUser = newValue;
    });
  }

}());
