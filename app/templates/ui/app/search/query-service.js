(function () {
  'use strict';

  angular.module('sample.search')
    .factory('QueryService', QueryService);

  function QueryService() {
    var query = { q: '' },
        callbacks = [];

    function unsubscribe(idx) {
      callbacks.splice(idx);
    }

    return {
      get: function() {
        return query;
      },
      set: function(q) {
        query = q;
        _.each(callbacks, function(callback) {
          callback(query);
        });
      },
      subscribe: function(callback) {
        var idx = callbacks.length;
        callbacks.push(callback);
        return function() {
          unsubscribe(idx);
        };
      }
    };
  }

}());
