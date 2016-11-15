(function () {
  'use strict';

  angular.module('app.landing')
    .controller('LandingCtrl', LandingCtrl);

  LandingCtrl.$inject = ['$scope'];

  function LandingCtrl($scope) {
    var ctrl = this;

    angular.extend(ctrl, {
    });
  }
}());
