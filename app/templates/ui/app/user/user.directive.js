(function () {

  'use strict';

  angular.module('sample.user')
    .directive('mlUser', UserDirective)
    .controller('UserController', UserController);

  function UserDirective() {
    return {
      restrict: 'EA',
      controller: 'UserController',
      controllerAs: 'ctrl',
      replace: true,
      scope: {},
      templateUrl: 'app/user/user-dir.html'
    };
  }

  UserController.$inject = ['$scope', 'userService'];

  function UserController($scope, userService) {
    var ctrl = this;
    angular.extend(ctrl, {
      username: null,
      password: null,
      currentUser: userService.currentUser(),
      loginError: userService.loginError(),
      user: userService,
      login: login,
      logout: logout
    });

    function login() {
      userService.login(ctrl.username, ctrl.password).then(function(user) {
        ctrl.currentUser = user;
        ctrl.loginError = userService.loginError();
      });
    }

    function logout() {
      userService.logout().then(function() {
        ctrl.currentUser = null;
        ctrl.loginError = userService.loginError();
      });
    }
  }

}());
