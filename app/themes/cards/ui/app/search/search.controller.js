/* global MLSearchController */
(function () {
  'use strict';

  angular.module('app.search')
    .controller('SearchCtrl', SearchCtrl);

  SearchCtrl.$inject = ['$scope', '$location', 'MLSearchFactory'];

  // inherit from MLSearchController
  var superCtrl = MLSearchController.prototype;
  SearchCtrl.prototype = Object.create(superCtrl);

  function SearchCtrl($scope, $location, searchFactory) {
    var ctrl = this;

    superCtrl.constructor.call(ctrl, $scope, $location, searchFactory.newContext({
      pageLength: 12
    }));

    ctrl.init();

    ctrl.setSnippet = function(type) {
      ctrl.mlSearch.setSnippet(type);
      ctrl.search();
    };
  }
}());
