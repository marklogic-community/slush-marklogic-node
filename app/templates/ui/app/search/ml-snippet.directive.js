(function () {

  'use strict';

  angular.module('app.snippet')
    .directive('mlSnippet', SnippetDirective)
    .controller('SnippetCtrl', SnippetCtrl);

  function SnippetDirective() {
    return {
      restrict: 'E',
      controller: 'SnippetCtrl',
      controllerAs: 'ctrl',
      replace: true,
      scope: {
        setSnippet: '&'
      },
      templateUrl: 'app/search/ml-snippet.html'
    };
  }

  SnippetCtrl.$inject = ['$scope'];

  function SnippetCtrl($scope) {
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
