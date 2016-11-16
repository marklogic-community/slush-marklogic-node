import template from './message-board-component.html';

const messageBoardComponent = {
  bindings: {
    msg: '='
  },
  controller: MessageBoardController,
  template: template,
};

MessageBoardController.$inject = ['$scope'];

function MessageBoardController($scope) {
  var ctrl = this;
  angular.extend(ctrl, {
    isObject: isObject,
    collapseRaw: collapseRaw,
    expandRaw: expandRaw
  });

  function isObject(item) {
    return _.isObject(item);
  }

  function collapseRaw() {
    ctrl.showRaw = false;
  }

  function expandRaw() {
    ctrl.showRaw = true;
  }
}

export
default messageBoardComponent;
