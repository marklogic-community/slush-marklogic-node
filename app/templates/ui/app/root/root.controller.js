(function () {
  'use strict';

  angular.module('app.root')
    .controller('RootCtrl', RootCtrl);

  RootCtrl.$inject = ['messageBoardService', 'userService', '$scope'];

  function RootCtrl(messageBoardService, userService, $scope) {
    var rootCtrl = this;
    rootCtrl.currentYear = new Date().getUTCFullYear();
    rootCtrl.messageBoardService = messageBoardService;

    $scope.$watch(userService.currentUser, function(newValue) {
      rootCtrl.currentUser = newValue;
    });
  }
}());
