(function() {
  'use strict';

  angular.module('app.detail')
    .component('detail', {
      bindings: {
        doc: '<'
      },
      controller: 'DetailCtrl',
      templateUrl: 'app/detail/detail.html'
    });

}());
