/* global MLSearchController */
(function () {
  'use strict';

  angular.module('app.search')
    .controller('SearchCtrl', SearchCtrl);

  SearchCtrl.$inject = ['$scope', '$location', 'MLSearchFactory',
    'MLQueryBuilder', 'MLUiGmapManager'];

  // inherit from MLSearchController
  var superCtrl = MLSearchController.prototype;
  SearchCtrl.prototype = Object.create(superCtrl);

  function SearchCtrl($scope, $location, searchFactory, qb, mlMapManager) {
    var ctrl = this;

    ctrl.limitToMap = true;
    ctrl.limitToIntersect = false;

    superCtrl.constructor.call(ctrl, $scope, $location, searchFactory.newContext({
      pageLength: 50
    }));

    ctrl.updateSearchResults = function(resp) {
      superCtrl.updateSearchResults.call(this,resp);
      mlMapManager.setResultMarkers(resp.results, null, function(result, i, color) {
        var r = result.extracted && result.extracted.content && result.extracted.content[0];
        if (r && r.location) {
          return {
            id: 'result-' + result.uri,
            location: r.location,
            title: r.name,
            content: r,
            icon: 'images/' + color + '-dot-marker.png'
          };
        }
      });
      mlMapManager.setFacetMarkers(resp.facets, function(facetName, box, i, color) {
        return {
          id: 'box-' + box.n + box.s + box.w + box.e + box.count,
          location: {
            latitude: (box.n + box.s) / 2,
            longitude: (box.w + box.e) / 2,
          },
          options: {
            labelContent: '' + box.count,
            labelAnchor: '' + (10 + ((('' + box.count).length - 1) * 3)) + ' 0',
            labelClass: 'cluster-marker-label'
          },
          box: box,
          icon: 'images/' + color + '-cluster-marker.png'
        };
      });
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

    $scope.$watch(function() {
      return ctrl.limitToMap;
    }, function(limit) {
      if (limit !== undefined) {
        var bounds = mlMapManager.watchBounds();
        var drawings = mlMapManager.watchDrawings();
        geoSearch(bounds, drawings);
      }
    });

    $scope.$watch(function() {
      return ctrl.limitToIntersect;
    }, function(limit) {
      if (limit !== undefined) {
        var bounds = mlMapManager.watchBounds();
        var drawings = mlMapManager.watchDrawings();
        geoSearch(bounds, drawings);
      }
    });

    $scope.$watch(mlMapManager.watchBounds, function(bounds) {
      if (bounds) {
        if (ctrl.limitToMap) {
          var drawings = mlMapManager.watchDrawings();
          geoSearch(bounds, drawings);
        }
      } else {
        // resetMap
        ctrl.mlSearch.clearAdditionalQueries();
        ctrl.search();
      }
    }, true);

    $scope.$watch(mlMapManager.watchDrawings, function(drawings) {
      if (drawings) {
        var bounds = mlMapManager.watchBounds();
        geoSearch(bounds, drawings);
      } else {
        // resetMap
        ctrl.mlSearch.clearAdditionalQueries();
        ctrl.search();
      }
    }, true);

    function geoQuery(bounds) {
      if (angular.isArray(bounds) && ctrl.limitToIntersect) {
        // AND query to get the intersect of all bounds and drawings
        var queries = [];
        angular.forEach(bounds, function(bound, index) {
          queries.push(
            qb.or(
              qb.ext.geospatialConstraint('Location', bound)
              // append more geospatial constraints here if there are multiple
            )
          );
        });
        return qb.and(queries);
      } else {
        // OR query to get a union of all bounds and drawings
        return qb.or(
          qb.ext.geospatialConstraint('Location', bounds)
          // append more geospatial constraints here if there are multiple
        );
      }
    }

    function geoSearch(bounds, drawings) {
      ctrl.mlSearch.clearAdditionalQueries();
      ctrl.mlSearch.addAdditionalQuery(
        qb.and(
          (ctrl.limitToMap && bounds) ? geoQuery(bounds) : qb.and(),
          drawings.length ? geoQuery(drawings) : qb.and()
        )
      );
      ctrl.search();
    }

  }
}());
