(function () {
  'use strict';

  angular.module('app.search')
    .factory('searchContextService', SearchContextService);

  SearchContextService.$inject = ['$http', '$rootScope', 'loginService'];
  function SearchContextService($http, $rootScope, loginService) {
    var _currentSearchContext = null;

    function currentSearchContext() {
      return _currentSearchContext;
    }

    function updateSearchContext(newContext) {
      _currentSearchContext = newContext;
    }

    return {
      currentSearchContext: currentSearchContext,
      updateSearchContext: updateSearchContext
    };
  }
}());
