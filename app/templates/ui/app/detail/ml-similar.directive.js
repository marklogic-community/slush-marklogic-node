(function () {

  'use strict';

  angular.module('app.similar')
    .directive('mlSimilar', mlSimilar);

  mlSimilar.$inject = ['MLRest'];

  function mlSimilar(mlRest) {
    return {
      restrict: 'E',
      templateUrl: 'app/detail/ml-similar.html',
      scope: { uri: '@', limit: '@?' },
      link: function($scope) {
        $scope._limit = toInt($scope.limit, 10);
        $scope.similar = [];
        mlRest.extension('extsimilar',
          {
            method: 'GET',
            params: {
              'rs:uri': $scope.uri,
              'rs:limit': $scope._limit
            }
          })
          .then(function(response) {
            var similar = (response && response.data && response.data.similar) || [];
            $scope.similar = angular.isArray(similar) ? similar : [similar];
            if ($scope.similar.length > $scope._limit) {
              $scope.similar.length = $scope._limit;
            }
          });
      }
    };
  }

  function toInt(str, def) {
    if (str) {
      var i = parseInt('' + str);
      return (!isNaN(i) && (i > 0)) ? i : def;
    } else {
      return def;
    }
  }

}());
