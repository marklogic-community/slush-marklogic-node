(function () {
  'use strict';

  angular.module('app.messageBoard')
    .factory('messageBoardService', MessageBoardService);

  MessageBoardService.$inject = ['$rootScope'];
  function MessageBoardService($rootScope) {
    var _message = null;

    function message(msg) {
      if (msg === undefined) {
        return _message;
      }
      _message = msg;
      if (message) {
        $rootScope.$broadcast('message-board:set', _message);
      } else {
        $rootScope.$broadcast('message-board:cleared');
      }
    }

    $rootScope.$on('$stateChangeSuccess', function() {
      message(null);
    });

    return {
      message: message
    };
  }
}());
