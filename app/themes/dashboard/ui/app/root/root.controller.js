(function () {
  'use strict';

  angular.module('app.root')
    .controller('RootCtrl', RootCtrl);

  RootCtrl.$inject = ['messageBoardService', 'userService', '$scope',
    'loginService', 'navService', '$state'];

  function RootCtrl(messageBoardService, userService, $scope,
    loginService, navService, $state) {

    var ctrl = this;
    ctrl.currentYear = new Date().getUTCFullYear();
    ctrl.messageBoardService = messageBoardService;

    $scope.$watch(userService.currentUser, function(newValue) {
      ctrl.currentUser = newValue;
    });

    // allow logout from custom header user section
    ctrl.loginService = loginService;

    // call this to register the available states
    navService.registerStates($state.get());

    ctrl.navService = navService;
  }
}());
