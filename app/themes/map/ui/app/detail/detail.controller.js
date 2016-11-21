/* global vkbeautify */
(function () {
  'use strict';
  angular.module('app.detail')
    .controller('DetailCtrl', DetailCtrl);

  DetailCtrl.$inject = ['doc', '$stateParams', 'MLRest', 'ngToast',
                        '$state', '$scope', 'x2js', 'MLUiGmapManager'];

  // TODO: inject vkbeautify
  function DetailCtrl(doc, $stateParams, MLRest, toast, $state, $scope, x2js, mlMapManager) {
    var ctrl = this;

    var uri = $stateParams.uri;

    var contentType = doc.headers('content-type');

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

    function deleteDocument() {
      MLRest.deleteDocument(uri).then(function(response) {
        // TODO: not reached with code coverage yet!

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
      }, function(response) {
        toast.danger(response.data);
      });
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
      if (ctrl.json.location && (ctrl.json.location.latitude !== undefined) &&
                                (ctrl.json.location.longitude !== undefined)) {
        ctrl.showMarker(ctrl.json.location.latitude, ctrl.json.location.longitude,
          ctrl.json, ctrl.json.name);
      }
    }

    angular.extend(ctrl, {
      doc : doc.data,
      uri : uri,
      delete: deleteDocument
    });
  }
}());
