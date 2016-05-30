(function () {
  'use strict';

  angular.module('app.root')
    .factory('rootUtils', RootUtilsFactory)
    .controller('RootCtrl', RootCtrl);

  function RootUtilsFactory() {
    var service = {}, width = window.innerWidth;

    service.isMobile = function() {
      return service.isXS() || service.isSM();
    };

    service.isXS = function() {
      return width < 768; // match boostrap xs
    };

    service.isSM = function() {
      return width < 992; // match bootrap sm
    };

    service.controlsAreShown = !service.isMobile();

    service.toggleControls = function() {
      service.controlsAreShown = !service.controlsAreShown;
    };

    service.hideControls = function() {
      service.controlsAreShown = false;
    };

    service.showControls = function() {
      service.controlsAreShown = true;
    };

    return service;
  }

  RootCtrl.$inject = ['messageBoardService', '$rootScope', '$scope','$templateRequest', '$compile', 'rootUtils', 'mlMapManager', '$timeout'];

  function RootCtrl(messageBoardService, $rootScope, $scope, $templateRequest, $compile, rootUtils, mlMapManager, $timeout) {
    var ctrl = this;
    ctrl.messageBoardService = messageBoardService;
    ctrl.currentYear = new Date().getUTCFullYear();

    var miw = window.jQuery('#app-mobile-info-window').get(0);
    var miwscope = $rootScope.$new(), mobileWin;
    var pixelOffset,shownMarker,boundsChanging,resetMap = true;

    var initCenterLat = 52.0325133;
    var initCenterLng = 5.2289087;
    var initZoom = 2;
    var initBounds = {
      southwest: {
        latitude: null,
        longitude: null
      },
      northeast: {
        latitude: null,
        longitude: null
      }
    };

    ctrl.isMobile = rootUtils.isMobile();

    if (ctrl.isMobile) {
      // compile the info window template
      $templateRequest('app/map/infoWindow.html').then(function(html) {
        var fn = $compile(html);
        var ele = fn(miwscope);
        miw.appendChild(ele[0]); // compile the template once, and we'll just update the scope
      });
    }

    ctrl.map = {
      center: {
        latitude: initCenterLat,
        longitude: initCenterLng
      },
      zoom: initZoom,
      bounds: initBounds,
      events: {
        bounds_changed: function() {
          // Compensate rapid firing of multiple bounds_changed events in sequence
          if (!boundsChanging) {
            boundsChanging = true;
            $timeout(function () {
              boundsChanging = false;
              if (!resetMap && ctrl.map.bounds.southwest.latitude) {
                mlMapManager.setBounds(ctrl.map.bounds);
              }
            }, 1000); // Note: this timeout must be smaller than initial one at end of ctrl
          }
        },
        rightclick: function() {
          $scope.$apply(function () {
            ctrl.map.center.latitude = initCenterLat;
            ctrl.map.center.longitude = initCenterLng;
            ctrl.map.zoom = initZoom;
            ctrl.map.bounds = initBounds;
            mlMapManager.setBounds(null);
            
            // Resetting of map causes bounds_changed events which we want to ignore
            resetMap = true;
            $timeout(function() {
              resetMap = false;
            }, 2000);
          });
        }
      }
    };

    ctrl.options = {
      scrollwheel: true,
      streetViewControl: false,
      disableDefaultUI: true,
      zoomControl: true
    };

    ctrl.markers = [];

    // watch for changes to the search results
    $scope.$watch(function() { return mlMapManager.markers; }, function(newVal) {
      ctrl.markers = newVal;
    });

    ctrl.markerClick = function(inst,evt,marker) {
      if (!pixelOffset) {
        pixelOffset = new google.maps.Size(0, -30);
        ctrl.infoWindow.options = { pixelOffset: pixelOffset };
      }
      
      var lat = inst.getPosition().lat() + 20;
      var lng = inst.getPosition().lng();
      var position = new google.maps.LatLng(lat, lng, true);

      if (! marker.content) {
        inst.map.setCenter(position);
      } else if (rootUtils.isMobile()) {
        if (!mobileWin) {
          mobileWin = new google.maps.InfoWindow({ content: '<span>' + marker.title + '</span>' });
          google.maps.event.addListener(mobileWin, 'closeclick', function() {
            miwscope.parameter.showMe = false;
            shownMarker = null;
            $scope.$apply();
          });
        } else {
          mobileWin.setContent('<span>' + marker.title + '</span>');
        }
        var shown = (shownMarker !== marker.title);
        if (shown) {
          mobileWin.open(inst.getMap(), inst);
        } else {
          mobileWin.close();
        }
        // for mobile we show our own window
        miwscope.parameter = marker.content;
        miwscope.parameter.showMe = shown;
        shownMarker = marker.title;
        inst.map.setCenter(position);

      } else {

        // otherwise manipulate the google map infowindow
        if (ctrl.infoWindow.shown) {
          ctrl.infoWindow.shown = false;
        } else {
          ctrl.infoWindow.coords = {
            latitude: marker.latitude,
            longitude: marker.longitude
          };
          ctrl.infoWindow.shown = true;
          ctrl.infoWindow.data = marker.content;
          
          inst.map.setCenter(position);
        }
      }
    };

    ctrl.closeClick = function() {
      ctrl.infoWindow.shown = false;
    };

    ctrl.infoWindow = {
      shown: false,
      templateUrl: 'app/map/infoWindow.html'
    };

    $timeout(function() {
      resetMap = false;
    }, 2000);
  }
}());
