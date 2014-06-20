(function () {
  'use strict';

  angular.module('sample.search')
    .controller('SearchCtrl', ['$scope', 'MLRest', 'User', '$location', function ($scope, mlRest, user, $location) {
      var model = {
        selected: [],
        text: '',
        user: user
      };

      var searchContext = mlRest.createSearchContext();

      function updateSearchResults(data) {
        model.search = data;
      }

      (function init() {
        searchContext
          .search()
          .then(updateSearchResults);
      })();

      angular.extend($scope, {
        model: model,
        selectFacet: function(facet, value) {
          var existing = model.selected.filter( function( selectedFacet ) {
            return selectedFacet.facet === facet && selectedFacet.value === value;
          });
          if ( existing.length === 0 ) {
            model.selected.push({facet: facet, value: value});
            searchContext
              .selectFacet(facet, value)
              .search()
              .then(updateSearchResults);
          }
        },
        clearFacet: function(facet, value) {
          var i;
          for (i = 0; i < model.selected.length; i++) {
            if (model.selected[i].facet === facet && model.selected[i].value === value) {
              model.selected.splice(i, 1);
              break;
            }
          }
          searchContext
            .clearFacet(facet, value)
            .search()
            .then(updateSearchResults);
        },
        textSearch: function() {
          searchContext
            .setText(model.text)
            .search()
            .then(updateSearchResults);
          $location.path('/');
        },
        pageChanged: function(page) {
          searchContext
            .setPage(page, model.pageLength)
            .search()
            .then(updateSearchResults);
        },
        getSuggestions: function(val) {
          return mlRest.callExtension('extsuggest', { 'method' : 'GET', 'params' : { 'rs:pqtxt' : val, 'rs:options' : 'all'} }).then(function(res){
            return res.suggestions;
          });
        }
      });

      $scope.$watch('model.user.authenticated', function(newValue, oldValue) {
        // authentication status has changed; rerun search
        searchContext.search().then(updateSearchResults, function(error) {
          model.search = {};
        });
      });

    }]);
}());
