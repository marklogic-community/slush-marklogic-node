(function () {
  'use strict';

  angular.module('app.landing')
    .controller('LandingCtrl', LandingCtrl);

  LandingCtrl.$inject = ['$scope', 'userService', 'MLSearchFactory', 'chartsService'];

  function LandingCtrl($scope, userService, searchFactory, chartsService) {

    var ctrl = this;

    angular.extend(ctrl, {
      eyeColor: chartsService.top10Chart('Eye Color', 'pie', 'eyeColor', 'Eye Color', 50),
      gender: chartsService.top10Chart('Gender', 'bar', 'gender', 'Gender', 50),
      combined: chartsService.top10Chartv2('Eye Color vs Gender', 'column', 'eyeColor', 'Eye Color',
                  'gender', 'Gender')
    });

    $scope.$watch(userService.currentUser, function(user) {
      if (user && user.authenticated) {
        if (!ctrl.mlSearch) {
          ctrl.mlSearch = searchFactory.newContext();
        }
        ctrl.mlSearch.search(); // trigger showing of charts
      } else {
        ctrl.mlSearch = null; // hide charts
      }
    });

  }

}());
