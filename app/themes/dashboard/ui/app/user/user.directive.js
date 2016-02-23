(function () {

  'use strict';

  angular.module('app.user')
    .directive('mlUser', UserDirective)
    .controller('UserController', UserController);

  function UserDirective() {
    return {
      restrict: 'EA',
      controller: 'UserController',
      controllerAs: 'ctrl',
      replace: true,
      scope: {
        showCancel: '=',
        mode: '@',
        callback: '&'
      },
      templateUrl: 'app/user/user-dir.html'
    };
  }

  UserController.$inject = ['$scope', 'userService', 'loginService'];

  function UserController($scope, userService, loginService) {
    var ctrl = this;
    angular.extend(ctrl, {
      username: null,
      password: null,
      loginService: loginService,
      userService: userService
    });
  }

}());
