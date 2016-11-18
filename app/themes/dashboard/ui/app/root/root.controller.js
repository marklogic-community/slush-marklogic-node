(function () {
  'use strict';

  angular.module('app.root')
    .controller('RootCtrl', RootCtrl);

  RootCtrl.$inject = ['messageBoardService', 'userService', '$scope',
    'loginService', 'navService', '$state'];

  function RootCtrl(messageBoardService, userService, $scope,
    loginService, navService, $state) {

    var rootCtrl = this;
    rootCtrl.currentYear = new Date().getUTCFullYear();
    rootCtrl.messageBoardService = messageBoardService;

    $scope.$watch(userService.currentUser, function(newValue) {
      rootCtrl.currentUser = newValue;
    });

    // allow logout from custom header user section
    rootCtrl.loginService = loginService;

    // call this to register the available states
    navService.registerStates($state.get());

    rootCtrl.navService = navService;
  }
}());
