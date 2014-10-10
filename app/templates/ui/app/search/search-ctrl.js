(function () {
  'use strict';

  angular.module('sample.search')
    .controller('SearchCtrl', ['$scope', 'MLRest', 'User', '$location', 'appConfig', 'StatelessSearch', 'QueryService', function ($scope, mlRest, user, $location, appConfig, statelessSearch, queryService) {
      var model = {
            selected: {},
            query: { q: '' },
            search: {},
            user: user
          },
          searchContext = mlRest.createSearchContext(),
          stateless = statelessSearch.new(searchContext, model.query);

      function updateSearchResults(data) {
        model.search = data;
        model.query = searchContext.serializeStructuredQuery();
        model.selected = searchContext.getSelectedFacets();
        queryService.set(model.query);
        if ( appConfig.statelessSearch ) {
          $location.search( model.query );
        }
      }

      (function init() {
        var unsubscribe = queryService.subscribe(function(query) {
              if (searchContext.getText() !== query.q) {
                angular.extend(model.query, query);
                $scope.textSearch();
              }
            });

        $scope.$on('$destroy', unsubscribe);

        searchContext.setText(queryService.get().q);

        if ( appConfig.statelessSearch ) {
          stateless.update().then(updateSearchResults);
          $scope.$on('$locationChangeSuccess', function(e, newUrl, oldUrl){
            stateless.locationChange(newUrl, oldUrl)
              .then(updateSearchResults);
          });
        } else {
          searchContext.search().then(updateSearchResults);
        }
      })();

      angular.extend($scope, {
        model: model,
        selectFacet: function(facet, value) {
          var type = model.search.facets[facet].type;
          searchContext
            .selectFacet(facet, value, type)
            .search()
            .then(updateSearchResults);
        },
        clearFacet: function(facet, value) {
          searchContext
            .clearFacet(facet, value)
            .search()
            .then(updateSearchResults);
        },
        textSearch: function() {
          searchContext
            .setText(model.query.q)
            .search()
            .then(updateSearchResults);
        },
        pageChanged: function(page) {
          searchContext
            .setPage(page, model.pageLength)
            .search()
            .then(updateSearchResults);
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
