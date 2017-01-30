(function () {
  'use strict';

  angular.module('app.root')
    .controller('RootCtrl', RootCtrl)
    .filter('isObject', function() {
      return function(val) {
        return angular.isObject(val);
      };
    })
    .filter('isArray', function() {
      return function(val) {
        return angular.isArray(val);
      };
    });

  RootCtrl.$inject = ['messageBoardService', 'userService', '$scope',
    '$state', 'appConfig', '$rootScope', '$templateRequest', '$compile',
    'mapUtils', 'MLUiGmapManager', 'uiGmapGoogleMapApi'];

  function RootCtrl(messageBoardService, userService, $scope,
    $state, appConfig, $rootScope, $templateRequest, $compile,
    mapUtils, mlMapManager, $googleMapsApi) {

    var rootCtrl = this;
    rootCtrl.currentYear = new Date().getUTCFullYear();
    rootCtrl.messageBoardService = messageBoardService;
    angular.extend(rootCtrl, appConfig);

    $scope.$watch(userService.currentUser, function(newValue) {
      rootCtrl.currentUser = newValue;
    });

    $scope.$watch(function() {
      return $state.current.name;
    }, function(newValue) {
      rootCtrl.currentState = newValue;
    });

    var miw = window.jQuery('#map-mobile-info-window').get(0); // FIXME: use angular.element?
    var miwscope = $rootScope.$new(), mobileWin;
    var pixelOffset,shownMarker,shown;
    var $googleMaps = null;

    $googleMapsApi.then(function($gMaps) {
      $googleMaps = $gMaps;
    });

    rootCtrl.mapManager = mlMapManager;
    mlMapManager.init(
      /* center */ { latitude: 52.0325133, longitude: 5.2289087 },
      /* zoom */ 2
    );

    if (miw && mapUtils.isMobile()) {
      rootCtrl.hideControls = true;
      // compile the info window template
      // FIXME: can we use ng-include somehow? or the compile directive?
      $templateRequest('app/root/infoWindow.html').then(function(html) {
        var fn = $compile(html);
        var ele = fn(miwscope);
        miw.appendChild(ele[0]); // compile the template once, and we'll just update the scope
      });
    }

    // FIXME: can we make more use of ui-gmap-window nested inside ui-gmap-markers directive?
    //        Alternatively, push away part of this code into a service or directive.
    //        RootUtils or app.map module perhaps?
    rootCtrl.markerClick = function(inst,evt,marker) {
      if (!$googleMaps) {
        return;
      }

      if (!pixelOffset) {
        pixelOffset = new $googleMaps.Size(0, -30);
        rootCtrl.infoWindow.options = { pixelOffset: pixelOffset };
      }

      var lat = inst.getPosition().lat() + 20;
      var lng = inst.getPosition().lng();
      var position = new $googleMaps.LatLng(lat, lng, true);

      if (!marker.content) {
        inst.map.setCenter(position);
        rootCtrl.infoWindow.shown = false;
        delete rootCtrl.infoWindow.data;
      } else if (mapUtils.isMobile()) {
        if (!mobileWin) {
          mobileWin = new $googleMaps.InfoWindow({ content: '<span>' + marker.title + '</span>' });
          google.maps.event.addListener(mobileWin, 'closeclick', function() {
            miwscope.parameter.showMe = false;
            shownMarker = null;
            $scope.$apply();
          });
        } else {
          mobileWin.setContent('<span>' + marker.title + '</span>');
        }
        shown = (shownMarker === marker.title);
        if (shown) {
          mobileWin.close();
        } else {
          mobileWin.open(inst.getMap(), inst);
        }
        // for mobile we show our own window
        miwscope.parameter = marker.content;
        miwscope.parameter.showMe = shown;
        miwscope.parameter.close = function() {
          mobileWin.close();
          miwscope.parameter.showMe = false;
          shownMarker = null;
        };
        shownMarker = marker.title;
        inst.map.setCenter(position);

      } else {

        // otherwise manipulate the google map infowindow
        shown = (shownMarker === marker.title);
        if (shown) {
          rootCtrl.infoWindow.shown = false;
          shownMarker = null;
        } else {
          rootCtrl.infoWindow.coords = {
            latitude: marker.location.latitude,
            longitude: marker.location.longitude
          };
          rootCtrl.infoWindow.shown = true;
          rootCtrl.infoWindow.data = marker.content;
          inst.map.setCenter(position);
          shownMarker = marker.title;
        }
      }
    };

    rootCtrl.closeClick = function() {
      rootCtrl.infoWindow.shown = false;
    };

    rootCtrl.infoWindow = {
      shown: false,
      templateUrl: 'app/root/infoWindow.html'
    };

  }
}());
