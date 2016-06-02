(function () {
  'use strict';

  var app = angular.module('app');

  app.service('mlMapManager', MapManager);

  function MapManager() {
    var service = {};

    service.markers = [];
    service.bounds = null;
    service.center = null;

    service.setMarkers = function(m) {
      // replace our markers
      service.markers = m;
    };

    service.addMarkers = function(m) {
      // add these markers to our copy
      service.markers = service.markers.concat(m);
    };

    service.setBounds = function(b) {
      // replace current bounds
      service.bounds = b;
    };
    
    service.setCenter = function(latitude, longitude) {
	  // replace the center of the map
      var center = {
        latitude: latitude,
        longitude: longitude
      }
      service.center = center;
    };

    return service;
  }
})();
