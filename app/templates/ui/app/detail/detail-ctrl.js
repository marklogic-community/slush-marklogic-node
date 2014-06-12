(function () {
  'use strict';

  angular.module('sample.detail')
    .controller('DetailCtrl', ['$scope', 'MLRest', '$routeParams', function ($scope, mlRest, $routeParams) {
      var uri = $routeParams.uri;
      var model = {
        // your model stuff here
        detail: {}
      };

      mlRest.getDocument(uri, { transform: 'detail' }).then(function(data) {
        model.detail = data;
        var z=0;
      });

      angular.extend($scope, {
        model: model

      });
    }]);
}());
