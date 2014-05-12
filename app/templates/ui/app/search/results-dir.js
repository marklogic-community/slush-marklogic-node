(function () {

  'use strict';

  var module = angular.module('sample.search');

  module.directive('results', [function () {
    return {
      restrict: 'E',
      scope: {
        results: '=resultList',
        updateQuery: '&updateQuery'
      },
      templateUrl: '/search/results-dir.html',
      link: function() {
      }
    };
  }]);
}());
