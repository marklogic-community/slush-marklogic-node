/* global mljs */

(function () {
  'use strict';

  angular.module('sample')
    .provider('MLJS', function() {

      // Rewrite the data.results part of the response from /v1/search so that the metadata section in each is easier
      // to work with.
      function rewriteResults(results) {
        var rewritten = [];
        var revised = {};
        var metadata, j, key, prop;

        for (var i in results) {
          if (results.hasOwnProperty(i)) {
            revised = {};
            for (prop in results[i]) {
              if (results[i].hasOwnProperty(prop)) {
                if (prop === 'metadata') {
                  metadata = {};
                  for (j in results[i].metadata) {
                    if (results[i].metadata.hasOwnProperty(j)) {
                      for (key in results[i].metadata[j]) {
                        if (results[i].metadata[j].hasOwnProperty(key)) {
                          if (metadata[key]) {
                            metadata[key].push(results[i].metadata[j][key]);
                          } else {
                            metadata[key] = [ results[i].metadata[j][key] ];
                          }
                        }
                      }
                    }
                  }
                  revised.metadata = metadata;
                } else {
                  revised[prop] = results[i][prop];
                }
              }
            }

            rewritten.push(revised);
          }
        }

        return rewritten;
      }

      this.$get = function($q, $http) {

        var db = new mljs();
        db.logger.setLogLevel('info');

        var service = {
          getSearchContext: function() {
            return db.createSearchContext();
          },
          selectFacet: function(ctx, name, value) {
            var d = $q.defer();
            ctx.promise(d.promise).contributeFacet(name, value);
            return d.promise;
          },
          clearFacet: function(ctx, name, value) {
            var d = $q.defer();
            ctx.promise(d.promise).deselectFacet(name, value);
            return d.promise;
          },
          search: function() {
            var d = $q.defer();
            db.search('', 'all', function(result) {
              if (result.inError) {
                d.reject(result.details);
              } else {
                result.doc.results = rewriteResults(result.doc.results);
                d.resolve(result.doc);
              }
            });
            return d.promise;
          },
          getDocument: function(uri, options) {
            var d = $q.defer();
            db.get(uri, options, function(result) {
              if (result.inError) {
                d.reject(result.details);
              } else {
                d.resolve(result.doc);
              }
            });
            return d.promise;
          },
          createDocument: function(doc, options) {
            // send a POST request to /v1/documents
            var d = $q.defer();
            $http.post(
              '/v1/documents',
              doc,
              {
                params: {
                  format: 'json',
                  directory: '/demos/',
                  extension: '.json'
                }
              })
              .success(function(data, status, headers, config) {
                d.resolve(headers('location'));
              }).error(function(reason) {
                d.reject(reason);
              });
            return d.promise;
          },
          patch: function(uri, patch) {
            $q.defer();
            $http.post(
              '/v1/documents',
              patch,
              {
                params: {
                  uri: uri
                },
                headers: {
                  'X-HTTP-Method-Override': 'PATCH',
                  'Content-Type': 'application/json'
                }
              }
            );
          }
        };

        return service;
      };
    });
}());
