(function () {
  'use strict';

  function MLSelectController() {
    var ctrl = this;
    ctrl.select = function(selectionName) {
      ctrl.onSelect({selectionName: selectionName});
    };
  }

  angular.module('app.search')
    .component('mlSelect', {
      templateUrl: 'app/search/ml-select.html',
      controller: MLSelectController,
      bindings: {
        label: '=',
        currentSelection: '=',
        selectionList: '=',
        onSelect: '&'
      }
    });

})();
