(function () {

  'use strict';

  var module = angular.module('sample.search');

  module.directive('results', [function () {
    return {
      restrict: 'E',
      scope: {
        results: '=resultList',
        total: '=total',
        start: '=start',
        pageLength: '=pageLength',
        currentPage: '=currentPage',
        paginate: '&paginate',
        updateQuery: '&updateQuery'
      },
      templateUrl: '/search/results-dir.html',
      link: function(scope) {
        scope.Math = window.Math;
      }
    };
  }]);
}());
