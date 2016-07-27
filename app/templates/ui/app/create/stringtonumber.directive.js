(function () {
  'use strict';

  angular.module('app.create')
    .directive('stringToNumber', StringToNumber);

  function StringToNumber () {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        ngModel.$parsers.push(function(value) {
          return '' + value;
        });
        ngModel.$formatters.push(function(value) {
          return parseFloat(value);
        });
      }
    };
  }

}());
