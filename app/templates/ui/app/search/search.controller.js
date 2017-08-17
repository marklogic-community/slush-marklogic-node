/* global MLSearchController */
(function() {
  'use strict';

  angular.module('app.search')
    .controller('SearchCtrl', SearchCtrl);

  SearchCtrl.$inject = ['$scope', '$location', 'MLSearchFactory'];

  // inherit from MLSearchController
  var superCtrl = MLSearchController.prototype;
  SearchCtrl.prototype = Object.create(superCtrl);

  function SearchCtrl($scope, $location, searchFactory) {
    var ctrl = this;

    superCtrl.constructor.call(ctrl, $scope, $location, searchFactory.newContext());

    ctrl.init();

    ctrl.setSnippet = function(type) {
      ctrl.mlSearch.setSnippet(type);
      ctrl.search();
    };

    ctrl.setSort = function(type) {
      ctrl.mlSearch.setSort(type);
      ctrl.search();
    };

    function listFromOperator(operatorArray, operatorType) {
      return (_.filter(
        operatorArray,
        function(val) {
          return val && val.state && val.state[0] && val.state[0][operatorType];
        }
      )[0] || { state: []}).state.map(function(state) {
        return state.name;
      });
    }

    ctrl.mlSearch.getStoredOptions().then(function(data) {
      ctrl.sortList = listFromOperator(data.options.operator, 'sort-order');
      ctrl.snippetList = listFromOperator(data.options.operator, 'transform-results');
    });

  }
}());
