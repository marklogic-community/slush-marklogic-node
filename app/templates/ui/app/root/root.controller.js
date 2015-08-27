(function () {
  'use strict';

  angular.module('app.root')
    .controller('RootCtrl', RootCtrl);

  RootCtrl.$inject = ['messageBoardService'];

  function RootCtrl(messageBoardService) {
    var ctrl = this;
    angular.extend(ctrl, {
      messageBoardService: messageBoardService
    });
  }
}());
