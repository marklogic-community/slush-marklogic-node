/* global MLSearchController */
(function () {
  'use strict';

  angular.module('app.search')
    .controller('SearchCtrl', SearchCtrl);

  SearchCtrl.$inject = ['$scope', '$location', 'userService', 'MLSearchFactory', 'mlMapManager'];

  // inherit from MLSearchController
  var superCtrl = MLSearchController.prototype;
  SearchCtrl.prototype = Object.create(superCtrl);

  function SearchCtrl($scope, $location, userService, searchFactory, mlMapManager) {
    var ctrl = this;
    var mlSearch = searchFactory.newContext({
        queryOptions: 'map'
    });

    superCtrl.constructor.call(ctrl, $scope, $location, mlSearch);

    ctrl.updateSearchResults = function(resp) {
      superCtrl.updateSearchResults.call(this,resp);
      console.log("update search results", resp);
      // process the new markers
      var markers = [];
      for (var i =0; i < resp.results.length; i++) {
        var r = resp.results[i].extracted.content[0]; // FIXME: this should be customized to match the data coming back from search results
        console.log(r);
        if (r.latitude && r.longitude) {
          var m = {
            latitude: r.latitude,
            longitude: r.longitude,
            title: r.name,
            id: i,
            content: r,
            icon: getCategoryIcon(r.newCategory)
          };
          markers.push(m);
        }
      }
      mlMapManager.setMarkers(markers);
    };

    ctrl.init();

    ctrl.setSnippet = function(type) {
      mlSearch.setSnippet(type);
      ctrl.search();
    };

    $scope.$watch(userService.currentUser, function(newValue) {
      ctrl.currentUser = newValue;
    });
  }
}());
