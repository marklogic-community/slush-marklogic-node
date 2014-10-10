(function () {
  'use strict';

  angular.module('sample.common')
    .factory('StatelessSearch', StatelessSearch);

  StatelessSearch.$inject = ['MLRest', '$location', '$q'];

  function StatelessSearch(mlRest, $location, $q) {

    function newContext(searchContext, query) {
      return new StatelessSearchContext(searchContext, query, mlRest, $location, $q);
    }

    return { new: newContext };
  }

  function StatelessSearchContext(searchContext, query, mlRest, $location, $q) {

    function updateSearchQuery(response, d) {
      var q = $location.search().q;

      if ( q !== query.q ) {
        searchContext.setText(q);
      }

      if ( response && response.query ) {
        searchContext.clearAllFacets();
        searchContext.parseStructuredQuery( response.query );
      }

      searchContext.search().then(function(data) {
        d.resolve(data);
      });
    }

    function getStructuredQuery(q) {
      return mlRest.callExtension('parse-query', {
        method: 'GET',
        params: {
          'rs:q': q,
          'rs:options': searchContext.getQueryOptions()
        }
      });
    }

    function pathEquals(newUrl, oldUrl) {
      // TODO: use $$urlUtils.urlResolve(), once it's available
      // see: https://github.com/angular/angular.js/pull/3302
      // from: https://stackoverflow.com/questions/21516891
      function pathName(href) {
        var x = document.createElement('a');
        x.href = href;
        return x.pathname;
      }

      return pathName(newUrl) === pathName(oldUrl);
    }

    function parseFacets(d) {
      var facets = $location.search().facets;

      if ( facets && facets !== query.facets ) {
        getStructuredQuery(facets, searchContext).then(function(response) {
          updateSearchQuery(response, d);
        });
      } else {
        if (!facets) {
          searchContext.clearAllFacets();
        }
        updateSearchQuery(null, d);
      }

      return d.promise;
    }

    function update() {
      var d = $q.defer();
      return parseFacets(d);
    }

    function locationChange(newUrl, oldUrl) {
      var d = $q.defer(),
          samePage = pathEquals(newUrl, oldUrl),
          sameQuery = _.isEqual(query, $location.search());

      if ( samePage && !sameQuery ) {
        parseFacets(d);
      } else {
        d.reject();
      }

      return d.promise;
    }

    return {
      update: update,
      locationChange: locationChange
    };
  }

}());
