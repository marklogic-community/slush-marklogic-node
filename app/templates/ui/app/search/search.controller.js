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

    //ctrl.init();
    (function init() {
      // monitor URL params changes (forward/back, etc.)
      ctrl.$scope.$on('$locationChangeSuccess', ctrl.locationChange.bind(ctrl));

      // capture initial URL params in mlSearch and ctrl
      if ( ctrl.parseExtraURLParams ) {
        ctrl.parseExtraURLParams();
      }

      if (searchModel.response) {
        ctrl.response = searchModel.response;
        ctrl.updateURLParams();
      } else {
        ctrl.mlSearch.fromParams().then( ctrl._search.bind(ctrl) );
      }
    })();

    ctrl.updateSearchResults = function updateSearchResults(data) {
      searchModel.response = data;
      this.searchPending = false;
      this.response = data;
      this.qtext = this.mlSearch.getText();
      this.page = this.mlSearch.getPage();
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
