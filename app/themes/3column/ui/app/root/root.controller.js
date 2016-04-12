(function () {
  'use strict';

  angular.module('app.root')
    .controller('RootCtrl', RootCtrl);

  RootCtrl.$inject = ['messageBoardService', 'userService', '$scope'];

  function RootCtrl(messageBoardService, userService, $scope) {
    var ctrl = this;
    ctrl.currentYear = new Date().getUTCFullYear();
    ctrl.messageBoardService = messageBoardService;

    $scope.user = userService;

    $scope.$watch('user.authenticated', function(newVal) {
      console.log('user auth changed', newVal);
      // do things that you care about
    });
  }
}());
