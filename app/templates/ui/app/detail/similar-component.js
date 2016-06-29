(function() {

  'use strict';

  angular.module('app.similar')
    .component('mlSimilar', {
      bindings: {
        uri: '@',
        limit: '@'
      },
      controller: MlSimilar,
      templateUrl: 'app/detail/similar-component.html'
    });

  MlSimilar.$inject = ['MLRest'];

  function MlSimilar(mlRest) {
    var ctrl = this;

    mlRest.extension('extsimilar', {
      method: 'GET',
      params: {
        'rs:uri': ctrl.uri,
        'rs:limit': ctrl.limit ? ctrl.limit : 10
      }
    }).then(function(response) {
      ctrl.similar = response.data.similar;
    });
  }


}());
