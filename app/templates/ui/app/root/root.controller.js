(function() {
  'use strict';

  angular.module('app.root')
    .controller('RootCtrl', RootCtrl);

  RootCtrl.$inject = ['messageBoardService', 'userService', 'loginService', '$scope'];

  function RootCtrl(messageBoardService, userService, loginService, $scope) {
    var ctrl = this;
    ctrl.currentYear = new Date().getUTCFullYear();
    ctrl.messageBoardService = messageBoardService;

    loginService.getAuthenticatedStatus();

    $scope.$watch(userService.currentUser, function(newValue) {
      ctrl.currentUser = newValue;
    });
  }
}());
