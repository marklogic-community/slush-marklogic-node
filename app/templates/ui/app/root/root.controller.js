(function () {
  'use strict';

  angular.module('app.root')
    .controller('RootCtrl', RootCtrl);

  RootCtrl.$inject = ['messageBoardService', 'userService', '$scope',
    '$state'];

  function RootCtrl(messageBoardService, userService, $scope,
    $state) {

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
  }
}());
