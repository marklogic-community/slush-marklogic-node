/* global MLSearchController */
(function () {
  'use strict';

  angular.module('app.search')
    .controller('SearchCtrl', SearchCtrl);

  SearchCtrl.$inject = ['$scope', '$location', 'userService', 'MLSearchFactory', 'MLQueryBuilder', 'MLUiGmapManager'];

  // inherit from MLSearchController
  var superCtrl = MLSearchController.prototype;
  SearchCtrl.prototype = Object.create(superCtrl);

  function SearchCtrl($scope, $location, userService, searchFactory, qb, mlMapManager) {
    var ctrl = this;

    superCtrl.constructor.call(ctrl, $scope, $location, searchFactory.newContext({ pageLength: 50 }));

    ctrl.updateSearchResults = function(resp) {
      superCtrl.updateSearchResults.call(this,resp);
      mlMapManager.setResultMarkers(resp.results);
      mlMapManager.setFacetMarkers(resp.facets);
    };

    ctrl.init();

    ctrl.setSnippet = function(type) {
      ctrl.mlSearch.setSnippet(type);
      ctrl.search();
    };

    ctrl.showFacetsOnMap = true;
    ctrl.toggleShowFacets = function() {
      mlMapManager.markerMode = ctrl.showFacetsOnMap ? 'facets' : 'results';
    };

    $scope.$watch(userService.currentUser, function(newValue) {
      ctrl.currentUser = newValue;
    });

    $scope.$watch(mlMapManager.watchBounds, function(newValue) {
      if (newValue) {
        ctrl.mlSearch.clearAdditionalQueries();
        ctrl.mlSearch.addAdditionalQuery(
          qb.or(
            qb.ext.geospatialConstraint('Location', newValue)
            // append more geospatial constraints here if there are multiple
          )
        );
        ctrl.search();
      } else {
        ctrl.mlSearch.clearAdditionalQueries();
        ctrl.search();
      }
    }, true);

  }
}());
