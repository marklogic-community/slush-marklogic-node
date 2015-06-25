(function () {

  'use strict';

  angular.module('sample.detailMap', [])
    .directive('detailMap', [function () {
      return {
        restrict: 'E',
        scope: {
          detail: '='
        },
        template: '<ui-gmap-google-map center="model.map.center" zoom="model.map.zoom" events="model.map.events" class="map-detail">' +
          '<ui-gmap-marker ng-repeat="m in model.markers" coords="m.coords" idKey="m.id" >' +
          '</ui-gmap-marker>' +
          '</ui-gmap-google-map>',
        controller: 'DetailMapController'
      };
    }])
    .controller('DetailMapController', ['$scope', function ($scope) {
      var model = {
        map: {
          center: {
            latitude: 45,
            longitude: -73
          },
          zoom: 6
        },
        markers: []
      };

      function addMarker(detail) {
        if (detail.latitude && detail.longitude) {
          model.markers.push({
            coords: {
              latitude: detail.latitude,
              longitude: detail.longitude
            },
            id: detail.id
          });

          model.map.center = {
            latitude: detail.latitude,
            longitude: detail.longitude
          };
        }
      }

      angular.extend($scope, {
        model: model
      });

      addMarker($scope.detail);

    }]);
}());

