(function() {

  'use strict';

  angular.module('app.user')
    .component('mlUser', {
      bindings: {
        showCancel: '=',
        mode: '@',
        callback: '&'
      },
      controller: UserController,
      templateUrl: 'app/user/user-component.html'
    });

  UserController.$inject = ['$scope', 'userService', 'loginService'];

  function UserController($scope, userService, loginService) {
    var ctrl = this;
    angular.extend(ctrl, {
      username: null,
      password: null,
      loginService: loginService
    });
    $scope.$watch(userService.currentUser, function(newValue) {
      ctrl.currentUser = newValue;
    });
  }

}());
