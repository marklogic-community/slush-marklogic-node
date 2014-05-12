(function () {

  'use strict';

  var module = angular.module('sample.search');

  module.directive('facets', [function () {
    return {
      restrict: 'E',
      scope: {
        facets: '=facetList',
        selected: '=selected',
        select: '&select',
        clear: '&clear'
      },
      templateUrl: '/search/facets-dir.html',
      link: function() {
      }
    };
  }]);
}());
