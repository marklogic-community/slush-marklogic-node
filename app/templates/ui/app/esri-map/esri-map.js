(function () {

  'use strict';

  angular.module('app.esriMap', [])
  .directive('esriMap', EsriMapDirective)
  .controller('EsriDetailMapController', EsriDetailMapController);

  function EsriMapDirective() {
    return {
      restrict: 'E',
      scope: {
        detail: '='
      },
      template: '<div id="_detailMap" class="map-detail"></div>',
      controller: 'EsriDetailMapController'
    };
  }

  EsriDetailMapController.$inject = ['$scope'];
  function EsriDetailMapController($scope) {
    var ctrl = this;
    ctrl.baseMap = 'national-geographic';
    ctrl.mapGeometry = null;

    initMap('_detailMap', $scope.detail);

    function initMap(containerId, geoData) {
      require([  // jshint ignore:line
        'esri/map', 'esri/graphic', 'esri/symbols/SimpleFillSymbol',
        'esri/symbols/SimpleMarkerSymbol', 'esri/layers/GraphicsLayer',
        'esri/geometry/Point', 'esri/geometry/Polygon',
        'esri/graphicsUtils', 'esri/Color'
        ], function(
          Map, Graphic, SimpleFillSymbol,
          SimpleMarkerSymbol, GraphicsLayer,
          Point, Polygon,
          graphicsUtils, Color
        )
        {
          processGeoData(geoData);

          ctrl.map = new Map(
            containerId, {
              basemap: ctrl.baseMap,
              zoom: 6,
              smartNavigation: false
            }
          );

          ctrl.graphicsLayer = new GraphicsLayer({id: 'data'});
          ctrl.map.addLayer(ctrl.graphicsLayer);
          ctrl.map.infoWindow.set('popupWindow', false);

          // Use the geometry information to draw on the map after
          // the map has completed loading.
          ctrl.map.on('load', function() {
            if (ctrl.mapGeometry) {
              ctrl.drawData(ctrl.mapGeometry);
            }
          });

          /**
          * Processes the geospatial data passed to the map in order to draw it on the map.
          */
          function processGeoData(geoData) {
            if (geoData && geoData.latitude && geoData.longitude) {
              ctrl.mapGeometry = [];
              ctrl.mapGeometry.push( new Point(geoData.longitude, geoData.latitude) );
            }
          }

          /**
          * Draw a shape on the map based on the specified geometry object.
          */
          ctrl.drawData = function(geometry) {
            if (geometry && geometry.length > 0) {
              for (var i = 0; i < geometry.length; i++) {
                var symbol = null;
                if (geometry[i] instanceof Point) {
                  symbol = new SimpleMarkerSymbol().setColor(new Color([0, 0, 0, 0.40]));
                } else if (geometry[i] instanceof Polygon) {
                  symbol = new SimpleFillSymbol().setColor( new Color([0, 0, 0, 0.40]) );
                }

                if (symbol) {
                  var graphic = new Graphic(geometry[i], symbol);
                  ctrl.graphicsLayer.add(graphic);
                }
              }
              // Set extent so that map zooms as close as possible and still
              //  shows all graphics.
              var myExtent = graphicsUtils.graphicsExtent(ctrl.graphicsLayer.graphics);
              ctrl.map.setExtent(myExtent, true);
            }
          };
        });
    }
  }
}());
