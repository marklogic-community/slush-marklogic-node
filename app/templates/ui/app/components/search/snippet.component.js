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

import template from './snippet.html';

const component = {
  bindings: {
    setSnippet: '&'
  },
  controller: SnippetController,
  template: template
};

export
default component;
