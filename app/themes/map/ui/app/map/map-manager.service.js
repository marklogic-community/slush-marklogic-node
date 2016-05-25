(function () {
    var app = angular.module('app');

    app.service('mlMapManager', MapManager);

    function MapManager() {
      var service = {};

      service.markers = [];

      service.setMarkers = function(m) {
        // replace our markers
        service.markers = m;
      }

      service.addMarkers = function(m) {
        // add these markers to our copy
        service.markers = service.markers.concat(m);
      }

      return service;
    }
})();
