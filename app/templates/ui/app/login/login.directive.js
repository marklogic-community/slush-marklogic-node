(function () {

  'use strict';

  angular.module('app.login')
    .directive('login', LoginDirective);

  function LoginDirective() {
    return {
      restrict: 'EA',
      controller: 'LoginCtrl',
      controllerAs: 'ctrl',
      replace: true,
      scope: {
        showCancel: '=',
        mode: '@',
        callback: '&'
      },
      templateUrl: 'app/login/login-dir.html'
    };
  }

}());
