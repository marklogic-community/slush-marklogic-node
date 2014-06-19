
var module = angular.module('sample.common', []);

module.filter('object2Array', function() {
  return function(input) {
    var out = [];
    for (var name in input) {
    	input[name].__key = name;
      out.push(input[name]);
    }
    return out;
  };
});