(function () {
  'use strict';

  var app = angular.module('app');

  app.service('MLUiGmapManager', ['$rootScope', '$timeout', MapManager]);

  function MapManager($rootScope, $timeout) {
    // internal defaults
    var defaultMapOptions = {
      scrollwheel: true,
      streetViewControl: false,
      disableDefaultUI: true,
      zoomControl: true
    };
    var defaultCenter = { latitude: 52.0325133, longitude: 5.2289087 };
    var defaultZoom = 2;
    var defaultBounds = {
      southwest: {
        latitude: null,
        longitude: null
      },
      northeast: {
        latitude: null,
        longitude: null
      }
    };
    var defaultEvents = {
      rightclick: function() {
        $timeout(function () {
          resetMap();
        },0);
      }
    };
    var defaultColors = [
      'green',
      'blue',
      'red',
      'grey',
      'purple'
    ];
    var resettingMap = true;
    var mlBounds = null;

    // keep track of multiple sets of markers
    var markers = {
      results: [],
      facets: []
    };

    // service interface
    var service = {
      // properties
      mapOptions: defaultMapOptions,
      center: angular.copy(defaultCenter),
      zoom: angular.copy(defaultZoom),
      bounds: angular.copy(defaultBounds),
      events: defaultEvents,
      markerMode: 'results',
      colors: angular.copy(defaultColors),
      
      // method
      init: init,
      getColor: getColor,
      getMarkers: getMarkers,
      setMarkers: setMarkers,
      setResultMarkers: setResultMarkers,
      setFacetMarkers: setFacetMarkers,
      watchBounds: watchBounds,
      resetMap: resetMap
    };

    // service init method
    function init(newCenter, newZoom) {
      defaultCenter = newCenter;
      defaultZoom = newZoom;
    }

    // the only property access wrappers
    function getColor(colorId) {
      return service.colors[colorId % service.colors.length];
    }

    function getMarkers() {
      return markers[service.markerMode];
    }

    // method implementations
    function setMarkers(mode, newMarkers) {
      markers[mode] = newMarkers;
    }

    function setResultMarkers(newResults, colorId) {
      var color = getColor(colorId || 0);
      // prepare result markers for consumption by angular-google-maps
      var newMarkers = [];
      angular.forEach(newResults, function(result, i) {
        var r = result.extracted.content[0];
        if (r.location) {
          var m = {
            id: 'result-' + result.uri,
            location: r.location,
            title: r.name,
            content: r,
            icon: 'images/'+color+'-dot-marker.png'
          };
          newMarkers.push(m);
        }
      });
      setMarkers('results', newMarkers);
    }

    function setFacetMarkers(newFacets) {
      var colorId = 0;
      // prepare facet markers for consumption by angular-google-maps
      var newMarkers = [];
      angular.forEach(newFacets, function(facet, facetName) {
        var color = getColor(colorId);
        angular.forEach(facet.boxes, function(box, i) {
          var m = {
            id: 'box-' + box.n + box.s + box.w + box.e + box.count,
            location: {
              latitude: (box.n + box.s) / 2,
              longitude: (box.w + box.e) / 2,
            },
            options: {
              labelContent: ''+box.count,
              labelAnchor: '' + (10 + (((''+box.count).length - 1) * 3)) +' 0',
              labelClass: 'cluster-marker-label'
            },
            box: box,
            icon: 'images/'+color+'-cluster-marker.png'
          };
          newMarkers.push(m);
        });
        if (facet.boxes) {
          colorId++;
        }
      });
      setMarkers('facets', newMarkers);
    }

    $rootScope.$watch(function() { return service.bounds; }, function() {
      // prepare bounds for consumption by ML search
      if (!resettingMap && service.bounds && service.bounds.southwest && service.bounds.southwest.latitude) {
        mlBounds = {
          'south': service.bounds.southwest.latitude,
          'west': service.bounds.southwest.longitude,
          'north': service.bounds.northeast.latitude,
          'east': service.bounds.northeast.longitude
        };
      } else {
        mlBounds = null;
      }
    }, true);

    function watchBounds() {
      return mlBounds;
    }

    function resetMap() {
      resettingMap = true;
      service.center = angular.copy(defaultCenter);
      service.zoom = angular.copy(defaultZoom);
      //service.bounds = angular.copy(defaultBounds);
      $timeout(function() {
        resettingMap = false;
      }, 2000);
    }

    $timeout(function() {
      resettingMap = false;
    }, 2000);

    return service;
  }
})();
