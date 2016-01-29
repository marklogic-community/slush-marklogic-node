/* global MLSearchController */
(function () {
  'use strict';

  angular.module('app.search')
    .factory('SearchModel', SearchModel)
    .controller('SearchCtrl', SearchCtrl);

  SearchModel.$inject = ['MLSearchFactory'];
  SearchCtrl.$inject = ['$scope', '$location', 'userService', 'SearchModel'];

  // inherit from MLSearchController
  var superCtrl = MLSearchController.prototype;
  SearchCtrl.prototype = Object.create(superCtrl);

  function SearchModel(searchFactory) {
    var mlSearch = searchFactory.newContext();
    return {
      mlSearch: mlSearch,
      response: null
    };
  }

  function SearchCtrl($scope, $location, userService, searchModel) {
    var ctrl = this;
    var mlSearch = searchModel.mlSearch;

    superCtrl.constructor.call(ctrl, $scope, $location, mlSearch);

    (function init() {
      //do not inherit method on purpose due to if statement

      // monitor URL params changes (forward/back, etc.)
      ctrl.$scope.$on('$locationChangeSuccess', ctrl.locationChange.bind(ctrl));

      // capture initial URL params in mlSearch and ctrl
      if ( ctrl.parseExtraURLParams ) {
        ctrl.parseExtraURLParams();
      }

      if (searchModel.response) {
        ctrl.updateSearchResults(searchModel.response);
        ctrl.updateURLParams();
      } else {
        ctrl.mlSearch.fromParams().then( ctrl._search.bind(ctrl) );
      }
    })();

    ctrl.updateSearchResults = function updateSearchResults(data) {
      superCtrl.updateSearchResults.apply(ctrl, arguments);
      searchModel.response = data;
      return this;
    };

    ctrl.setSnippet = function(type) {
      mlSearch.setSnippet(type);
      ctrl.search();
    };

    $scope.$watch(userService.currentUser, function(newValue) {
      ctrl.currentUser = newValue;
    });
  }
}());
