(function () {

  'use strict';

  angular.module('app.snippet')
    .directive('mlSnippet', SnippetDirective)
    .controller('SnippetController', SnippetController);

  function SnippetDirective() {
    return {
      restrict: 'E',
      controller: 'SnippetController',
      controllerAs: 'ctrl',
      replace: true,
      scope: {
        setSnippet: '&'
      },
      templateUrl: 'app/search/snippet.html'
    };
  }

  SnippetController.$inject = ['$scope'];

  function SnippetController($scope) {
    $scope.snippets = ['detailed', 'compact'];

    var ctrl = this;
    angular.extend(ctrl, {
      setSnippetType: setSnippetType
    });

    function setSnippetType(type) {
      $scope.snippetType = type;
      $scope.setSnippet({type: type});
    }
  }

}());
