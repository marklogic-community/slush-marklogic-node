/* global MLSearchController */
(function () {
  'use strict';

  angular.module('app.search')
    .controller('SearchCtrl', SearchCtrl);

  SearchCtrl.$inject = ['$scope', '$location', 'userService', 'MLSearchFactory',
    'MLQueryBuilder', 'MLUiGmapManager'];

  // inherit from MLSearchController
  var superCtrl = MLSearchController.prototype;
  SearchCtrl.prototype = Object.create(superCtrl);

  function SearchCtrl($scope, $location, userService, searchFactory, qb, mlMapManager) {
    var ctrl = this;

    superCtrl.constructor.call(ctrl, $scope, $location, searchFactory.newContext({
      pageLength: 50
    }));

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
    ctrl.toggleShowFacets();

    $scope.$watch(userService.currentUser, function(newValue) {
      ctrl.currentUser = newValue;
    });

    $scope.$watch(mlMapManager.watchBounds, function(bounds) {
      if (bounds) {
        var drawings = mlMapManager.watchDrawings();
        ctrl.mlSearch.clearAdditionalQueries();
        ctrl.mlSearch.addAdditionalQuery(
          qb.and(
            bounds ? geoQuery(bounds) : qb.and(),
            drawings.length ? geoQuery(drawings) : qb.and()
          )
        );
        ctrl.search();
      } else {
        // resetMap
        ctrl.mlSearch.clearAdditionalQueries();
        ctrl.search();
      }
    }, true);

    $scope.$watch(mlMapManager.watchDrawings, function(drawings) {
      if (drawings) {
        var bounds = mlMapManager.watchBounds();
        ctrl.mlSearch.clearAdditionalQueries();
        ctrl.mlSearch.addAdditionalQuery(
          qb.and(
            bounds ? geoQuery(bounds) : qb.and(),
            drawings.length ? geoQuery(drawings) : qb.and()
          )
        );
        ctrl.search();
      } else {
        // resetMap
        ctrl.mlSearch.clearAdditionalQueries();
        ctrl.search();
      }
    }, true);

    function geoQuery(bounds) {
      return qb.or(
        qb.ext.geospatialConstraint('Location', bounds)
        // append more geospatial constraints here if there are multiple
      );
    }

  }
}());
