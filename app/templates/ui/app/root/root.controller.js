(function () {
  'use strict';

  angular.module('app.root')
    .controller('RootCtrl', RootCtrl);

  RootCtrl.$inject = ['$state', 'messageBoardService'];

  function RootCtrl($state, messageBoardService) {
    var ctrl = this;
    angular.extend(ctrl, {
      currentState: $state.current.name,
      messageBoardService: messageBoardService
    });
  }
}());
