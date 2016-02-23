(function () {

  'use strict';

  angular.module('app.messageBoard')
    .directive('messageBoard', MessageBoardDirective)
    .controller('MessageBoardController', MessageBoardController);

  function MessageBoardDirective() {
    return {
      restrict: 'E',
      controller: 'MessageBoardController',
      controllerAs: 'ctrl',
      replace: true,
      scope: {
        msg: '='
      },
      templateUrl: 'app/message-board/message-board-dir.html'
    };
  }

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
