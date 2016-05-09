(function () {
  'use strict';

  angular.module('app.root')
    .factory('rootUtils', RootUtilsFactory)
    .controller('RootCtrl', RootCtrl);

  function RootUtilsFactory() {
    var service = {}, height = window.innerHeight, width = window.innerWidth;

    console.log('service width', width);

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
  };

  RootCtrl.$inject = ['messageBoardService', '$rootScope', '$scope','$templateRequest', '$compile', 'rootUtils'];

  function RootCtrl(messageBoardService, $rootScope, $scope, $templateRequest, $compile, rootUtils) {
    var ctrl = this;
    ctrl.messageBoardService = messageBoardService;
    ctrl.currentYear = new Date().getUTCFullYear()

    var miw = window.jQuery('#app-mobile-info-window').get(0);
    var miwscope = $rootScope.$new(), mobileWin;

    ctrl.isMobile = rootUtils.isMobile();

    if (ctrl.isMobile) {
      // compile the info window template
      $templateRequest('app/map/infoWindow.html').then(function(html) {
        console.log('template', html);
        var fn = $compile(html);
        var ele = fn(miwscope);
        console.log('compiled', ele);
        miw.appendChild(ele[0]); // compile the template once, and we'll just update the scope
      });
    }

    // watch for changes to the search results and rebuild the map markers
    var initCenterLat = 52.0325133;
    var initCenterLng = 5.2289087;
    var initZoom = 7;
    ctrl.map = {
      center: {
        latitude: initCenterLat,
        longitude: initCenterLng
      },
      zoom: initZoom,
      events: {
        rightclick: function() {
          $scope.$apply(function () {
            ctrl.map.center.latitude = initCenterLat;
            ctrl.map.center.longitude = initCenterLng;
            ctrl.map.zoom = initZoom;
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

    $scope.$watch(function() { return ctrl.searchResults; }, function(newVal) {
      if (newVal) {
        // process the new markers
        var markers = [];
        for (var i =0; i < newVal.results.length; i++) {
          var r = newVal.results[i].extracted.content[0].doc;
          if (r.lat && r.long) {
            var m = {
              latitude: r.lat,
              longitude: r.long,
              title: r.name,
              id: i,
              content: r,
              icon: getCategoryIcon(r.newCategory)
            };
            markers.push(m);
          }
        }
        ctrl.markers = markers;
      }
    });

    var pixelOffset,shownMarker, winopts;
    ctrl.markerClick = function(inst,evt,marker) {
      if (!pixelOffset) {
        pixelOffset = new google.maps.Size(0, -30);
        ctrl.infoWindow.options = { pixelOffset: pixelOffset };
      }
      if (rootUtils.isMobile()) {
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
        console.log('is mobile', marker.title);
        miwscope.parameter = marker.content;
        miwscope.parameter.showMe = shown;
        shownMarker = marker.title;
        inst.map.setCenter(inst.getPosition());
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
          inst.map.setCenter(inst.getPosition());
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



  }
}());
