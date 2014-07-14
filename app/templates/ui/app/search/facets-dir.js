(function () {

  'use strict';

  angular.module('sample.search')
    .filter('object2Array', function() {
      return function(input) {
        var out = [];
        for (var i in input) {
          out.push(input[i]);
        }
        return out;
      };
    })
    .directive('facets', [function () {
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
