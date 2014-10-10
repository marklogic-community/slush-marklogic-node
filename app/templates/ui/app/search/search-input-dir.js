(function () {

  'use strict';

  angular.module('sample.search')
    .directive('searchInput', searchInput)
    .controller('SearchInputController', SearchInputController);

  function searchInput() {
    return {
      restrict: 'E',
      controller: 'SearchInputController',
      scope: {},
      templateUrl: '/search/search-input-dir.html',
      link: function(scope, element, attrs) {
        scope.query = { q: '' };
      }
    };
  }

  SearchInputController.$inject = ['$scope', '$location', '$route', 'MLRest', 'QueryService'];

  function SearchInputController($scope, $location, $route, mlRest, queryService) {
    var searchPath = getSearchRoute().originalPath,
        unsubscribe = queryService.subscribe(function(query) {
          $scope.query = query;
        });

    $scope.$on('$destroy', unsubscribe);

    function getSearchRoute() {
      var routes = _.where($route.routes, { controller: 'SearchCtrl' }),
          route = {};

      if (routes.length >= 1) {
        route = routes[0];

        if (routes.length > 1) {
          console.log('multiple Search controller routes; choosing \'' + route.originalPath + '\'');
        }

      } else {
        console.log(routes);
        console.error('can\t find Search controller');
        //TODO: get route from directive attribute?
        // or throw new Error('can\t find Search controller');
      }

      return route;
    }

    function search() {
      queryService.set( $scope.query );
      $location.path( searchPath );
    }

    function clear() {
      $scope.query = { q: '' };
      search();
    }

    function suggest(val) {
      //TODO: get from directive attribute?
      var options = 'all';

      return mlRest.callExtension('extsuggest', {
        method: 'GET',
        params: {
          'rs:pqtxt': val,
          'rs:options': options
        }
      }).then(function(res) {
        return res.suggestions || [];
      });
    }

    angular.extend($scope, {
      search: search,
      clear: clear,
      suggest: suggest
    });

  }
}());
