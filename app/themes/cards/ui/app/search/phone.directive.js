(function () {
  'use strict';

  var app = angular.module('app.phone', []);
  app.directive('phone', function() {
    return {
        restrict: 'E',
        replace: 'true',
        templateUrl: 'app/search/phone.html',
        scope: {
          phoneNumber: '='
        }
    };

  });
}());
