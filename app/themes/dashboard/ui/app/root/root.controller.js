(function () {
  'use strict';

  angular.module('app.root')
    .controller('RootCtrl', RootCtrl);

  RootCtrl.$inject = ['messageBoardService', 'userService', '$scope',
    '$state', 'loginService', 'navService'];

  function RootCtrl(messageBoardService, userService, $scope,
    $state, loginService, navService) {

    var rootCtrl = this;
    rootCtrl.currentYear = new Date().getUTCFullYear();
    rootCtrl.messageBoardService = messageBoardService;

    $scope.$watch(userService.currentUser, function(newValue) {
      rootCtrl.currentUser = newValue;
    });

    $scope.$watch(function() {
      return $state.current.name;
    }, function(newValue) {
      rootCtrl.currentState = newValue;
    });

    // allow logout from custom header user section
    rootCtrl.loginService = loginService;

    // call this to register the available states
    navService.registerStates($state.get());

    rootCtrl.navService = navService;
  }
}());
