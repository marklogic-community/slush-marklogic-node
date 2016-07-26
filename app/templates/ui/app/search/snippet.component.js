(function() {

  'use strict';

  angular.module('app.snippet')
    .component('mlSnippet', {
      bindings: {
        setSnippet: '&'
      },
      controller: SnippetController,
      templateUrl: 'app/search/snippet.html'
    });

  SnippetController.$inject = ['$scope'];

  function SnippetController($scope) {
    var ctrl = this;
    ctrl.snippets = ['compact', 'detailed'];

    angular.extend(ctrl, {
      setSnippetType: setSnippetType
    });

    function setSnippetType(type) {
      ctrl.snippetType = type;
      ctrl.setSnippet({
        type: type
      });
    }
  }

}());
