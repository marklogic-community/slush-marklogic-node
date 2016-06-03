(function() {
  'use strict';

  angular.module('app').controller('SidebarController', SidebarController);

  SidebarController.$inject = ['$scope', 'navService'];

  function SidebarController($scope, navService) {
    var ctrl = this;
    ctrl.navService = navService;
    $scope.$watch(ctrl.navService.getState, function(newVal) {
      $scope.sidebarState = newVal;
      if (newVal) {
        $scope.sidebarClass = 'wrapper skin-black sidebar-mini sidebar-open';
      } else {
        $scope.sidebarClass = 'wrapper skin-black sidebar-mini sidebar-collapse';
      }

    });

  }
}());
