/* global MLSearchController */
(function () {
  'use strict';

  angular.module('app.search')
    .controller('SearchCtrl', SearchCtrl);

  SearchCtrl.$inject = ['$scope', '$location', 'userService', 'searchContextService',
   'MLSearchFactory'];

  // inherit from MLSearchController
  var superCtrl = MLSearchController.prototype;
  SearchCtrl.prototype = Object.create(superCtrl);

  function SearchCtrl($scope, $location, userService, searchContextService, searchFactory) {
    var ctrl = this;
    var initialRun = false;

    if (!searchContextService.currentSearchContext()) {
      initialRun = true;
      searchContextService.updateSearchContext(searchFactory.newContext());
    }

    var mlSearch = searchContextService.currentSearchContext();

    superCtrl.constructor.call(ctrl, $scope, $location, mlSearch);

    if (initialRun) {
      ctrl.init();
    }
    else
    {
      ctrl.updateURLParams();
      ctrl.search();
    }

    ctrl.setSnippet = function(type) {
      mlSearch.setSnippet(type);
      ctrl.search();
    };

    $scope.$watch(userService.currentUser, function(newValue) {
      ctrl.currentUser = newValue;
    });
  }
}());
