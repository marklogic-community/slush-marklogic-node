(function() {

  'use strict';

  angular.module('app.messageBoard')
    .component('messageBoard', {
      bindings: {
        msg: '='
      },
      controller: MessageBoardController,
      templateUrl: 'app/message-board/message-board-component.html',
    });

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

}());
