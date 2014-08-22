
angular.module('sample.common', [])
  .filter('object2Array', function() {
    'use strict';

    return function(input) {
      var out = [];
      for (var name in input) {
        input[name].__key = name;
        out.push(input[name]);
      }
      return out;
    };
});
