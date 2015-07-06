(function () {
  'use strict';

  angular.module('sample.detail')
    .controller('DetailCtrl', DetailCtrl);

  DetailCtrl.$inject = ['doc'];
  function DetailCtrl(doc) {
    var ctrl = this;
    angular.extend(ctrl, {
      doc: doc
    });
  }
}());
