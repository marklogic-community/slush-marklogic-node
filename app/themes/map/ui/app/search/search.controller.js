/* global MLSearchController */
(function () {
  'use strict';

  angular.module('app.search')
    .controller('SearchCtrl', SearchCtrl);

  SearchCtrl.$inject = ['$scope', '$location', 'userService', 'MLSearchFactory', 'MLQueryBuilder', 'mlMapManager'];

  // inherit from MLSearchController
  var superCtrl = MLSearchController.prototype;
  SearchCtrl.prototype = Object.create(superCtrl);

  function SearchCtrl($scope, $location, userService, searchFactory, qb, mlMapManager) {
    var ctrl = this;

    superCtrl.constructor.call(ctrl, $scope, $location, searchFactory.newContext({ pageLength: 50 }));

    ctrl.showClusteredResults = false;

    ctrl.updateSearchResults = function(resp) {
      superCtrl.updateSearchResults.call(this,resp);

      // process the new markers
      var markers = [];
      if (! ctrl.showClusteredResults) {
        angular.forEach(resp.results, function(result, i) {

          // Note: the following matches the sample-data, customize as needed for different data
          var r = result.extracted.content[0];
          if (r.location.latitude && r.location.longitude) {
            var m = {
              latitude: r.location.latitude,
              longitude: r.location.longitude,
              title: r.name,
              id: i,
              content: r,
              icon: 'images/green-dot-marker.png'
            };
            markers.push(m);
          }
        });

      // Note: the following matches the example search options, customize as needed for different data
      } else if (resp.facets.Location) {
        angular.forEach(resp.facets.Location.boxes, function(box, i) {
          var m = {
            latitude: (box.n + box.s) / 2,
            longitude: (box.w + box.e) / 2,
            title: box.count,
            id: i,
            icon: 'images/green-cluster-marker.png'
          };
          markers.push(m);
        });
      }
      mlMapManager.setMarkers(markers);
    };

    ctrl.init();

    ctrl.setSnippet = function(type) {
      ctrl.mlSearch.setSnippet(type);
      ctrl.search();
    };

    $scope.$watch(userService.currentUser, function(newValue) {
      ctrl.currentUser = newValue;
    });

    ctrl.bounds = [];

    $scope.$watch(function() { return mlMapManager.bounds; }, function(newVal) {
      ctrl.boundsChanged(newVal);
    }, true);

    ctrl.boundsChanged = function(newBounds) {
      ctrl.bounds = newBounds;
      if (newBounds) {
        var bounds = {
          'south': newBounds.southwest.latitude,
          'west': newBounds.southwest.longitude,
          'north': newBounds.northeast.latitude,
          'east': newBounds.northeast.longitude
        };

        ctrl.mlSearch.clearAdditionalQueries();
        ctrl.mlSearch.addAdditionalQuery(
          qb.or(
            qb.ext.geospatialConstraint('Location', bounds)
            // append more geospatial constraints here if there are multiple
          )
        );
        ctrl.search();
      } else {
        ctrl.mlSearch.clearAdditionalQueries();
        ctrl.search();
      }
    };

  }
}());
