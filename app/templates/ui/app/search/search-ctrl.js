(function () {
  'use strict';

  angular.module('sample.search')
    .controller('SearchCtrl', ['$scope', '$location', 'User', 'MLSearchFactory', 'MLRemoteInputService', function ($scope, $location, user, searchFactory, remoteInput) {
      var mlSearch = searchFactory.newContext(),
          model = {
            page: 1,
            qtext: '',
            search: {},
            user: user
          };

      (function init() {
        // wire up remote input subscription
        remoteInput.initCtrl($scope, model, mlSearch, search);

        // run a search when the user logs in
        $scope.$watch('model.user.authenticated', function() {
          search();
        });

        // capture initial URL params in mlSearch and ctrl model
        mlSearch.fromParams().then(function() {
          // if there was remote input, capture it instead of param
          mlSearch.setText(model.qtext);
          updateSearchResults({});
        });

        // capture URL params (forward/back, etc.)
        $scope.$on('$locationChangeSuccess', function(e, newUrl, oldUrl){
          mlSearch.locationChange( newUrl, oldUrl ).then(function() {
            search();
          });
        });
      })();

      function updateSearchResults(data) {
        model.search = data;
        model.qtext = mlSearch.getText();
        model.page = mlSearch.getPage();

        remoteInput.setInput( model.qtext );
        $location.search( mlSearch.getParams() );
      }

      function search(qtext) {
        if ( !model.user.authenticated ) {
          model.search = {};
          return;
        }

        if ( arguments.length ) {
          model.qtext = qtext;
        }

        mlSearch
          .setText(model.qtext)
          .setPage(model.page)
          .search()
          .then(updateSearchResults);
      }

      angular.extend($scope, {
        model: model,
        search: search,
        toggleFacet: function toggleFacet(facetName, value) {
          mlSearch
            .toggleFacet( facetName, value )
            .search()
            .then(updateSearchResults);
        }
      });

    }]);
}());
