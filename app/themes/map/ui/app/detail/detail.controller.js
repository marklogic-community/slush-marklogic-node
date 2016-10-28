/* global X2JS,vkbeautify */
(function () {
  'use strict';
  angular.module('app.detail')
  .controller('DetailCtrl', DetailCtrl);

  DetailCtrl.$inject = ['doc', '$stateParams', 'MLUiGmapManager','MLRest',
    'ngToast','$state','$scope','userService'];

  function DetailCtrl(doc, $stateParams, mlMapManager, MLRest, toast, $state, $scope, userService) {
    var ctrl = this;

    var uri = $stateParams.uri;

    var contentType = doc.headers('content-type');

    var x2js = new X2JS();
    /* jscs: disable */
    if (contentType.lastIndexOf('application/json', 0) === 0) {
      /*jshint camelcase: false */
      ctrl.xml = vkbeautify.xml(x2js.json2xml_str(
          { xml: doc.data }
      ));
      ctrl.json = doc.data;
      ctrl.type = 'json';
    } else if (contentType.lastIndexOf('application/xml', 0) === 0) {
      ctrl.xml = vkbeautify.xml(doc.data);
      /*jshint camelcase: false */
      ctrl.json = x2js.xml_str2json(doc.data).xml;
      ctrl.type = 'xml';
      /* jscs: enable */
    } else if (contentType.lastIndexOf('text/plain', 0) === 0) {
      ctrl.xml = doc.data;
      ctrl.json = {'Document' : doc.data};
      ctrl.type = 'text';
    } else if (contentType.lastIndexOf('application', 0) === 0 ) {
      ctrl.xml = 'Binary object';
      ctrl.json = {'Document type' : 'Binary object'};
      ctrl.type = 'binary';
    } else {
      ctrl.xml = 'Error occured determining document type.';
      ctrl.json = {'Error' : 'Error occured determining document type.'};
    }

    ctrl.showMarker = function(latitude, longitude, content, name) {
      var newMarkers = [];
      var m = {
        location: {
          latitude: latitude,
          longitude: longitude
        },
        title: name,
        id: 'detail-' + uri,
        content: content,
        icon: 'images/red-dot-marker.png'
      };
      newMarkers.push(m);
      mlMapManager.setMarkers('detail', newMarkers);
      mlMapManager.markerMode = 'detail';
      mlMapManager.center = { latitude: latitude, longitude: longitude };
    };

    if (ctrl.type === 'json' || ctrl.type === 'xml') {
      //note that this should be matched with the exact data

      ctrl.showMarker(ctrl.json.location.latitude, ctrl.json.location.longitude,
        ctrl.json, ctrl.json.name);
    }

    function deleteFunc() {
      MLRest.deleteDocument (uri).then(function(response) {
        // create a toast with settings:
        toast.create({
          className: 'warning',
          content: 'Deleted ' + uri,
          dismissOnTimeout: true,
          timeout: 2000,
          onDismiss: function () {
            //redirect to search page
            $state.go('root.search');
          }
        });
      });
    }

    angular.extend(ctrl, {
      doc : doc.data,
      uri : uri,
      currentUser: null,
      delete: deleteFunc
    });

    $scope.$watch(userService.currentUser, function(newValue) {
      ctrl.currentUser = newValue;
    });
  }
}());
