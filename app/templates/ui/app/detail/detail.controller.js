(function () {
  'use strict';

  angular.module('app.detail')
    .controller('DetailCtrl', DetailCtrl);

  DetailCtrl.$inject = ['doc', '$stateParams'];
  function DetailCtrl(doc, $stateParams) {
    var ctrl = this;
    angular.extend(ctrl, {
      doc: doc,
      uri: $stateParams.uri
    });
  }
}());
