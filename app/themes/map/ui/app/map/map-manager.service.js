(function () {
  'use strict';

  angular.module('app.root')
    .service('MLUiGmapManager', ['$rootScope', '$timeout', 'uiGmapGoogleMapApi', MapManager]);

  function MapManager($rootScope, $timeout, $googleMapsApi) {
    var service = {};

    // Google Maps API is loaded asynchroniously..
    var $googleMaps = null;

    // internal defaults
    var defaultMapOptions = {
      scrollwheel: true,
      streetViewControl: false,
      disableDefaultUI: true,
      zoomControl: true
    };
    var defaultDrawingOptions = null;
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
          angular.forEach(service.drawings, function(drawing) {
            drawing.setMap(null);
          });
          service.drawings = [];
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
    var changingBounds = true;
    var mlBounds = null;
    var mlDrawings = [];

    // keep track of multiple sets of markers
    var markers = {
      results: [],
      facets: []
    };

    // service interface
    angular.extend(service, {
      // method
      init: init,
      restoreDefaults: restoreDefaults,
      getColor: getColor,
      getMarkers: getMarkers,
      setMarkers: setMarkers,
      setResultMarkers: setResultMarkers,
      setFacetMarkers: setFacetMarkers,
      watchBounds: watchBounds,
      watchDrawings: watchDrawings,
      resetMap: resetMap
    });

    // service init method
    function init(newCenter, newZoom) {
      defaultCenter = newCenter;
      defaultZoom = newZoom;
    }

    // (re)set properties to defaults
    function restoreDefaults() {
      angular.extend(service, {
        mapOptions: angular.copy(defaultMapOptions),
        drawingOptions: defaultDrawingOptions ? angular.copy(defaultDrawingOptions) : null,
        center: angular.copy(defaultCenter),
        zoom: angular.copy(defaultZoom),
        bounds: angular.copy(defaultBounds),
        events: defaultEvents,
        drawings: [],
        drawingControl: {},
        markerMode: 'facets',
        colors: angular.copy(defaultColors),
      });
    }
    restoreDefaults();

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
            icon: 'images/' + color + '-dot-marker.png'
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
              labelContent: '' + box.count,
              labelAnchor: '' + (10 + ((('' + box.count).length - 1) * 3)) + ' 0',
              labelClass: 'cluster-marker-label'
            },
            box: box,
            icon: 'images/' + color + '-cluster-marker.png'
          };
          newMarkers.push(m);
        });
        if (facet.boxes) {
          colorId++;
        }
      });
      setMarkers('facets', newMarkers);
    }

    // to consume Google Maps drawing directly
    function addDrawing(googleOverlay) {
      if (googleOverlay) {
        var bounds;

        // circle
        if (googleOverlay.getRadius) {
          bounds = {
            point: getPoint(googleOverlay.getCenter()),
            radius: googleOverlay.getRadius() * 0.00062137 // convert meters to miles
          };
        // polygon
        } else if (googleOverlay.getPaths) {
          bounds = {
            point: getPoints(googleOverlay.getPaths())
          };
        // we don't support proximity search yet
        // // polyline
        // } else if (googleOverlay.getPath) {
        //   bounds = {
        //     point: getPoints(googleOverlay.getPath())
        //   };
        // // marker
        // } else if (googleOverlay.getPosition) {
        //   bounds = getPoint(googleOverlay.getPosition());
        // rectangle
        } else if (googleOverlay.getBounds) {
          var googleBounds = googleOverlay.getBounds();
          bounds = {
            south: googleBounds.getSouthWest().lat(),
            west: googleBounds.getSouthWest().lng(),
            north: googleBounds.getNorthEast().lat(),
            east: googleBounds.getNorthEast().lng()
          };
        }

        if (bounds) {
          $timeout(function () {
            mlDrawings.push(bounds);
          });
        }
      }
    }

    $rootScope.$watch(function() { return service.bounds; }, function() {
      // prepare bounds for consumption by ML search
      if (!changingBounds) {
        if (service.bounds && service.bounds.southwest && service.bounds.southwest.latitude) {
          changingBounds = true;
          mlBounds = {
            south: service.bounds.southwest.latitude,
            west: service.bounds.southwest.longitude,
            north: service.bounds.northeast.latitude,
            east: service.bounds.northeast.longitude
          };
          $timeout(function() {
            changingBounds = false;
          }, 2000);
        } else {
          mlBounds = null;
        }
      }
    }, true);

    function watchBounds() {
      return mlBounds;
    }

    function watchDrawings() {
      return mlDrawings;
    }

    function resetMap() {
      changingBounds = true;
      service.center = angular.copy(defaultCenter);
      service.zoom = angular.copy(defaultZoom);
      mlBounds = null;
      mlDrawings = [];
      $timeout(function() {
        changingBounds = false;
      }, 2000);
    }

    // Delayed init of drawingOptions, waits for Google Maps API..
    $googleMapsApi.then(function($g) {
      $googleMaps = $g;
      if ($googleMaps.drawing) {
        defaultDrawingOptions = {
          drawingControl: true,
          drawingControlOptions: {
            position: $googleMaps.ControlPosition.TOP_CENTER,
            drawingModes: [
              $googleMaps.drawing.OverlayType.CIRCLE,
              //$googleMaps.drawing.OverlayType.MARKER, // we don't support proximity search yet
              $googleMaps.drawing.OverlayType.POLYGON,
              //$googleMaps.drawing.OverlayType.POLYLINE, // we don't support proximity search yet
              $googleMaps.drawing.OverlayType.RECTANGLE
            ]
          }
        };
        service.drawingOptions = service.drawingOptions || angular.copy(defaultDrawingOptions);
      }
    });

    $rootScope.$watch(function() {
      return service.drawingControl.getDrawingManager;
    }, function(manager) {
      if ($googleMaps && manager) {
        $googleMaps.event.addListener(manager(), 'overlaycomplete', function(overlayEvent) {
          service.drawings.push(overlayEvent.overlay);
          addDrawing(overlayEvent.overlay);
        });
      }
    });

    $timeout(function() {
      changingBounds = false;
    }, 2000);

    return service;
  }

  function getPoints(arr) {
    var points = [];
    angular.forEach(arr, function(a, index) {
      if (a.length) {
        points = points.concat(getPoints(a));
      } else {
        points.push(getPoint(a));
      }
    });
    return points;
  }

  function getPoint(googleLatLng) {
    return {
      latitude: googleLatLng.lat(),
      longitude: googleLatLng.lng()
    };
  }

})();
