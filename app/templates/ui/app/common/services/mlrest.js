(function () {
  'use strict';

  angular.module('sample.common')
    .provider('MLRest', function() {

      // Rewrite the data.results part of the response from /v1/search so that the metadata section in each is easier
      // to work with.
      function rewriteResults(results) {
        var rewritten = [];
        var revised = {};
        var metadata;

        angular.forEach(results, function(result, i) {
          revised = {};

          angular.forEach(result, function(property, prop) {
            if (prop === 'metadata') {
              metadata = {};
              
              angular.forEach(property, function(field, j) {
                angular.forEach(field, function(value, key) {
                  if (key !== 'metadata-type') {
                    if (metadata[key] === undefined) {
                      metadata[key] = { name: key, 'metadata-type': field['metadata-type'] };
                    }
                    if (metadata[key].values) {
                      metadata[key].values.push(value);
                    } else {
                      metadata[key].values = [ value ];
                    }
                  }
                });
              });
              
              revised.metadata = metadata;
            } else {
              revised[prop] = result[prop];
            }
          });
          
          rewritten.push(revised);
        });
        
        return rewritten;
      }
      
      function rewriteOptions(options) {
        if (!options) {
          options = {};
        }
        // rewrite facet constraints
        options.facets = {};
        angular.forEach(options.constraint, function(constraint) {
          var isFacet =
            constraint.range ? constraint.range.facet !== false :
            constraint.collection ? constraint.collection.facet !== false :
            true;
          
          if (isFacet) {
            var facetType =
              constraint.range ? constraint.range.bucket ? 'bucketed' : constraint.range.type :
              constraint.collection ? 'collection' :
              constraint['geo-elem-pair'] || constraint['geo-attr-pair'] ||
                constraint['geo-elem'] || constraint['geo-path'] ? 'geospatial' :
              constraint.custom && constraint.annotation &&
                (constraint.annotation[0]['geo-elem-pair'] || constraint.annotation[0]['geo-attr-pair'] ||
                 constraint.annotation[0]['geo-elem'] || constraint.annotation[0]['geo-path']
                ) ?
                  'custom-geospatial' :
              'unknown';
            constraint.type = facetType;
            options.facets[constraint.name] = constraint;
          }
        });
        // rewrite sort operators
        options.sorts = {};
        angular.forEach(options.operator, function(operator){
          if (operator.name === 'sort') {
            angular.forEach(operator.state, function(state){
              options.sorts[state.name] = state;
            });
          }
        });
        // rewrite result operators
        options.results = {};
        angular.forEach(options.operator, function(operator){
          if (operator.name === 'results') {
            angular.forEach(operator.state, function(state){
              options.results[state.name] = state;
            });
          }
        });
        // rewrite values
        var values = {};
        angular.forEach(options.values, function(value){
          values[value.name] = value;
        });
        options.values = values;
        // rewrite tuples
        var tuples = {};
        angular.forEach(options.tuples, function(tuple){
          tuples[tuple.name] = tuple;
        });
        return options;
      }

      function SearchContext(options, $q, $http, qb) {
        options = options || {};

        var facetSelections = [];
        var textQuery = null;
        var start = 1;
        var pageLength = 10;
        var sort = null;
        var additionalQueries = [];
        var boostQueries = [];
        var bounds = null;
        var snippet = 'compact';
        var searchOptions = null;
        var pagingQuery = null;
        
        (function init(){
          options.queryOptions = options.queryOptions ? options.queryOptions : 'all';
          // Will usually result in a 401 unauthorized..
          // if (!searchOptions) {
          //   getSearchOptions();
          // }
        })();
        
        function getStructuredQuery(includeProperties, skipConstraints, adhocQuery) {
          var queries = [];
          
          if (! skipConstraints) {
            skipConstraints = [];
          }
          
          angular.forEach(facetSelections, function(selected) {
            var facet = selected.facet;
            var value = selected.value;
            var type = facet.type;
            var query;
            
            if (skipConstraints.indexOf(facet.name) < 0) {
              if (type === 'collection') {
                query = qb.collectionConstraintQuery(facet.name, value);
              } else if (facet.boxes) {
                // geo-constraint
                var coords = value.replace(/[\[\]]/g,'').split(',');
                query = qb.geospatialConstraintQuery(facet.name, [{
                  'south': coords[0],
                  'west': coords[1],
                  'north': coords[2],
                  'east': coords[3]
                }]);
              } else if (type === 'bucketed') {
                query = qb.textQuery(facet.name + ':"' + value + '"');
              } else {
                query = qb.rangeConstraintQuery(facet.name, 'EQ', [value], []);
              }
              queries.push(query);
            }
          });
          
          if (textQuery) {
            queries.push(
              qb.textQuery(textQuery)
            );
          }
          
          if (bounds) {
            var geoQueries = [];
            angular.forEach(searchOptions.facets, function(facet, key) {
              if (facet.type === 'geospatial') {
                geoQueries.push(
                  qb.geospatialConstraintQuery(facet.name, [bounds])
                );
              } else if (facet.type === 'custom-geospatial') {
                geoQueries.push(
                  qb.customGeospatialConstraintQuery(facet.name, 'heatmap,2', bounds)
                );
              }
            });
            queries.push(
              qb.orQuery(geoQueries)
            );
          }
          
          angular.forEach(additionalQueries, function(item) {
            // wrap additionalQueries inside dummy boostQueries to make them ignored by highlighting
            //queries.push(qb.boostQuery(item,qb.andQuery()));
            // [GJo] boostQuery makes ML crash!
            queries.push(item);
          });
          
          if (pagingQuery) {
            // wrap pagingQuery inside dummy boostQuery to make it ignored by highlighting
            // queries.push(qb.boostQuery(pagingQuery,qb.andQuery()));
            // [GJo] boostQuery makes ML crash!
            queries.push(pagingQuery);
          }
          
          if (adhocQuery) {
            queries.push(adhocQuery);
          }
          
          // add boost-query's if there are any
          angular.forEach(boostQueries, function(boostQuery) {
            queries.push(
              qb.boostQuery(
                qb.andQuery(), // apply each boost to everything
                boostQuery
              )
            );
          });
          
          var structured;
          // wrap queries inside an extra properties-query if properties need to be searched as well, and prevent circ ref with slice
          if (includeProperties) {
            structured =
              qb.structuredQuery(
                qb.orQuery(
                  qb.andQuery(queries),
                  qb.propertiesQuery(
                    qb.andQuery(queries)
                  )
                )
              );
          } else {
            // nothing special, just queries. These are and-queried by default
            structured = qb.structuredQuery(queries);
          }
          
          // TODO: this assumes that the sort operator is called "sort", but
          // that isn't necessarily true. Properly done, we'd get the options
          // from the server and find the operator that contains sort-order
          // elements
          if (sort) {
            structured.query.queries.push(
              qb.operatorState('sort', sort)
            );
          }
          
          // TODO: this assumes that the snippet operator is called "results", but
          // that isn't necessarily true. Properly done, we'd get the options
          // from the server and find the operator that contains transform-results
          // elements
          if (snippet) {
            structured.query.queries.push(
              qb.operatorState('results', snippet)
            );
          }
          
          return structured;
        }
        
        function getSearchOptions() {
          var d = $q.defer();
          $http.get(
            '/v1/config/query/' + options.queryOptions,
            {
              params: {
                format: 'json',
                options: options.queryOptions,
                structuredQuery: getStructuredQuery(),
                start: start,
                pageLength: options.pageLength,
                transform: options.transform
              }
            })
          .success(
            function(data) {
              data.options = rewriteOptions(data.options);
              searchOptions = data.options;
              d.resolve(data);
            })
          .error(
            function(reason) {
              d.reject(reason);
            });
          return d.promise;
        }
        
        var runSearch = function(view, adhocQuery, stopRecurse) {
          if (!searchOptions && !stopRecurse) {
            return getSearchOptions().then(function(data) {
              return runSearch(view, adhocQuery, true);
            });
          } else {
            var d = $q.defer();
            $http.get(
              '/v1/search',
              {
                params: {
                  format: 'json',
                  options: options.queryOptions,
                  structuredQuery: getStructuredQuery(options.includeProperties, null, adhocQuery),
                  start: start,
                  pageLength: pageLength,
                  view: view ? view : 'all'
                }
              })
            .success(
              function(data) {
                data.results = rewriteResults(data.results);
                d.resolve(data);
              })
            .error(
              function(reason) {
                d.reject(reason);
              });
            return d.promise;
          }
        };

        var getSuggestions = function(partialQuery, queryOptions, stopRecurse) {
          if (!searchOptions && !stopRecurse) {
            return getSearchOptions().then(function(data) {
              return getSuggestions(partialQuery, queryOptions, true);
            });
          } else {
            var d = $q.defer();
            $http.get(
              '/v1/suggest',
              {
                params: {
                  format: 'json',
                  options: queryOptions ? queryOptions : options.queryOptions,
                  'partial-q': partialQuery
                }
              })
            .success(
              function(data) {
                d.resolve(data);
              })
            .error(
              function(reason) {
                d.reject(reason);
              });
            return d.promise.then(function(response){
              return response.suggestions;
            });
          }
        };
        
        var getValues = function(facetName, unconstrained, view) {
          if (!searchOptions) {
            return getSearchOptions().then(function(data) {
              var query = unconstrained ? null : getStructuredQuery(options.includeProperties);
              return getValues_(facetName, query, view);
            });
          } else {
            var query = unconstrained ? null : getStructuredQuery(options.includeProperties);
            return getValues_(facetName, query, view);
          }
        };
        
        var getAllValues = function(unconstrained, view) {
          if (!searchOptions) {
            return getSearchOptions().then(function(data) {
              var query = unconstrained ? null : getStructuredQuery(options.includeProperties);
              var queries = [];
              angular.forEach(searchOptions.values, function(value){
                queries.push(getValues_(value.name, query, view));
              });
              return $q.all(queries);
            });
          } else {
            var query = unconstrained ? null : getStructuredQuery(options.includeProperties);
            var queries = [];
            angular.forEach(searchOptions.values, function(value){
              queries.push(getValues_(value.name, query, view));
            });
            return $q.all(queries);
          }
        };
        
        var getAllTuples = function(unconstrained, view) {
          if (!searchOptions) {
            return getSearchOptions().then(function(data) {
              var query = unconstrained ? null : getStructuredQuery(options.includeProperties);
              var queries = [];
              angular.forEach(searchOptions.tuples, function(tuple){
                queries.push(getValues_(tuple.name, query, view));
              });
              return $q.all(queries);
            });
          } else {
            var query = unconstrained ? null : getStructuredQuery(options.includeProperties);
            var queries = [];
            angular.forEach(searchOptions.tuples, function(tuple){
              queries.push(getValues_(tuple.name, query, view));
            });
            return $q.all(queries);
          }
        };
        
        function getValues_(facetName, query, view) {
          var d = $q.defer();
          $http.get(
            '/v1/values/'+facetName,
            {
              params: {
                format: 'json',
                options: options.queryOptions,
                structuredQuery: query,
                view: view ? view : 'all'
              }
            })
          .success(
            function(data) {
              d.resolve(data);
            })
          .error(
            function(reason) {
              d.reject(reason);
            });
          return d.promise;
        }
        
        var getFacet = function(facetName, unconstrained, skipConstraints, stopRecurse) {
          if (!searchOptions && !stopRecurse) {
            return getSearchOptions().then(function(data) {
              return getFacet(facetName, unconstrained, skipConstraints, true);
            });
          } else {
            var d = $q.defer();
            $http.get(
              '/v1/search',
              {
                params: {
                  format: 'json',
                  options: facetName,
                  structuredQuery: unconstrained ? null : getStructuredQuery(options.includeProperties, skipConstraints),
                  view: 'facets'
                }
              })
            .success(
              function(data) {
                d.resolve(data);
              })
            .error(
              function(reason) {
                d.reject(reason);
              });
            return d.promise;
          }
        };
        
        var searchSimilar = function(uris, myOptions, stopRecurse) {
          if (!searchOptions && !stopRecurse) {
            return getSearchOptions().then(function(data) {
              return searchSimilar(uris, myOptions, true);
            });
          } else {
            var d = $q.defer();
            $http.get(
              '/v1/search',
              {
                params: {
                  format: 'json',
                  options: myOptions,
                  structuredQuery:
                    qb.structuredQuery(
                      qb.documentQuery(uris)
                    ),
                  view: 'results'
                }
              })
            .success(
              function(data) {
                data.results = rewriteResults(data.results);
                d.resolve(data);
              })
            .error(
              function(reason) {
                d.reject(reason);
              });
            return d.promise;
          }
        };
        
        return {
          facetSelections: facetSelections,
          selectFacet: function(facet, value) {
            var existing = facetSelections.filter(function(selected) {
              return selected.facet.name === facet.name && selected.value === value;
            });
            if (existing.length === 0) {
              facetSelections.push({
                facet: facet,
                value: value
              });
            }
            return this;
          },
          replaceFacet: function(facet, value) {
            var i;
            for (i = 0; i < facetSelections.length; i++) {
              var selected = facetSelections[i];
              if (selected.facet.name === facet.name) {
                facetSelections.splice(i, 1);
              }
            }
            facetSelections.push({
              facet: facet,
              value: value
            });
            return this;
          },
          clearFacet: function(facet, value) {
            var i;
            for (i = 0; i < facetSelections.length; i++) {
              var selected = facetSelections[i];
              if (selected.facet.name === facet.name && selected.value === value) {
                facetSelections.splice(i, 1);
                break;
              }
            }
            return this;
          },
          clearAllFacets: function() {
            facetSelections.length = 0;
            return this;
          },
          getSelectedFacetValue: function(name) {
            var existing = facetSelections.filter(function(selected) {
              return selected.facet.name === name;
            });
            return existing.length > 0 ? existing[0].value : null;
          },
          getQueryOptions: function() {
            return options.queryOptions;
          },
          getAllOptions: function() {
            return options;
          },
          getSearchOptions: function() {
            return searchOptions;
          },
          getStructuredQuery: getStructuredQuery,
          search: runSearch,
          searchFacets: function() {
            return runSearch('facets');
          },
          searchResults: function() {
            return runSearch('results');
          },
          adhocSearch: function(adhocQuery) {
            return runSearch('results', adhocQuery);
          },
          setText: function(text) {
            if (text !== '') {
              textQuery = text;
            } else {
              textQuery = null;
            }
            return this;
          },
          clearSort: function() {
            sort = null;
            return this;
          },
          setSort: function(newSort) {
            sort = newSort;
            return this;
          },
          clearSnippet: function() {
            snippet = 'compact';
            return this;
          },
          setSnippet: function(newSnippet) {
            snippet = newSnippet;
            return this;
          },
          clearAdditionalQueries: function() {
            additionalQueries = [];
            return this;
          },
          setAdditionalQueries: function(newAdditionalQueries) {
            if (arguments.length === 1 && angular.isArray(newAdditionalQueries)) {
              additionalQueries = newAdditionalQueries;
            } else {
              additionalQueries = Array.prototype.slice.call(arguments);
            }
            return this;
          },
          clearBoostQueries: function() {
            boostQueries = [];
            return this;
          },
          setBoostQueries: function(newBoostQueries) {
            if (arguments.length === 1 && angular.isArray(newBoostQueries)) {
              boostQueries = newBoostQueries;
            } else {
              boostQueries = Array.prototype.slice.call(arguments);
            }
            return this;
          },
          setPage: function(page, myPageLength) {
            if (myPageLength) {
              start = 1 + (page - 1) * myPageLength;
            } else {
              start = 1 + (page - 1) * pageLength;
            }
            return this;
          },
          setPageLength: function(newPageLength) {
            pageLength = newPageLength;
            return this;
          },
          clearPagingQuery: function() {
            pagingQuery = null;
            return this;
          },
          setPagingQuery: function(newPagingQuery) {
            pagingQuery = newPagingQuery;
            return this;
          },
          clearBounds: function() {
            bounds = null;
            return this;
          },
          setBounds: function(newBounds) {
            // This expects a google.maps.LatLng object
            var south = newBounds.getSouthWest().lat();
            var west = newBounds.getSouthWest().lng();
            var north = newBounds.getNorthEast().lat();
            var east = newBounds.getNorthEast().lng();
            bounds = {
              'south': south,
              'west': west,
              'north': north,
              'east': east
            };
            return this;
          },
          getSuggestions: getSuggestions,
          getValues: getValues,
          getAllValues: getAllValues,
          getAllTuples: getAllTuples,
          getFacet: getFacet,
          searchSimilar: searchSimilar,
          hasGeoFacets: function() {
            var hasGeo = false;
            if (searchOptions) {
              angular.forEach(searchOptions.facets, function(facet, key) {
                if (facet.type === 'geospatial') {
                  hasGeo = true;
                } else if (facet.type === 'custom-geospatial') {
                  hasGeo = true;
                }
              });
            }
            return hasGeo;
          },
          
        };
      }

      this.$get = ['$q', '$http', 'MLQueryBuilder', function($q, $http, qb) {
        var service = {
          checkLoginStatus: function() {
            var d = $q.defer();
            $http.get('/user/status', {})
            .success(
              function(data) {
                d.resolve(data);
              })
            .error(
              function(reason) {
                d.reject(reason);
              });
            return d.promise;
          },
          login: function(username, password) {
            var d = $q.defer();
            $http.get(
              '/user/login',
              {
                params: {
                  'username': username,
                  'password': password
                }
              })
            .success(
              function(data) {
                d.resolve(data);
              })
            .error(
              function(reason) {
                d.reject(reason);
              });
            return d.promise;
          },
          logout: function() {
            var d = $q.defer();
            $http.get(
              '/user/logout',
              {})
            .success(
              function(data) {
                d.resolve(data);
              })
            .error(
              function(reason) {
                d.reject(reason);
              });
            return d.promise;
          },
          createSearchContext: function(options) {
            return new SearchContext(options, $q, $http, qb);
          },
          getDocument: function(uri, options) {
            var d = $q.defer();
            if (options === undefined || options === null) {
              options = {};
            }
            angular.extend(options, {
              format: 'json',
              uri: uri
            });
            $http.get(
              '/v1/documents',
              {
                params: options
              })
            .success(
              function(data) {
                d.resolve(data);
              })
            .error(
              function(reason) {
                d.reject(reason);
              });
            return d.promise;
          },
          adhocSearch: function(adhocQuery, queryOptions, start, pageLength) {
            var d = $q.defer();
            $http.get(
              '/v1/search',
              {
                params: {
                  format: 'json',
                  options: queryOptions ? queryOptions : 'all',
                  structuredQuery: qb.structuredQuery(adhocQuery),
                  start: start ? start : 1,
                  pageLength: pageLength ? pageLength : 10,
                  view: 'results'
                }
              })
            .success(
              function(data) {
                data.results = rewriteResults(data.results);
                d.resolve(data);
              })
            .error(
              function(reason) {
                d.reject(reason);
              });
            return d.promise;
          },
          sparqlSearch: function (sparqlQuery) {
            var d = $q.defer();
            //console.log(sparqlQuery);
            $http.post('/v1/graphs/sparql',
              sparqlQuery,{
              headers : {
                'Content-type': 'application/sparql-query',
                'Accept': 'application/sparql-results+json'
              }
            })
            .success(function(data, status, headers, config) {
              d.resolve(data.results.bindings);
            }).error(function(reason) {
              d.reject(reason);
            });
            return d.promise;
          },
          // [GJo] updateDoc is probably more useful for creating docs as it allows choosing uri yourself
          createDocument: function(doc, options) {
            // send a POST request to /v1/documents
            return $http.post(
              '/v1/documents',
              doc,
              {
                params: options
              });
          },
          updateDocument: function(doc, options, headers) {
            // send a PUT request to /v1/documents
            var d = $q.defer();
            $http.put(
              '/v1/documents',
              doc,
              {
                params: options,
                headers: headers
              })
              .success(function(data, status, headers, config) {
                d.resolve(headers('location'));
              }).error(function(reason) {
                d.reject(reason);
              });
            return d.promise;
          },
          patch: function(uri, patch) {
            var d = $q.defer();
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
            )
            .success(function(data, status, headers, config) {
                d.resolve(headers('location'));
              })
            .error(function(reason) {
                d.reject(reason);
              });
            return d.promise;
          },
          advancedCall: function(url, settings) {
            var d = $q.defer();
            var method = settings.method;
            var isSupportedMethod = (method === 'GET' || method === 'PUT' || method === 'POST' || method === 'DELETE');
            method = isSupportedMethod ? method : 'POST';
            if (!isSupportedMethod) {
              settings.headers = settings.headers || {};
              settings.headers['X-HTTP-Method-Override'] = settings.method;
            }

            $http(
              {
                url: url,
                data: settings.data,
                method: method,
                params: settings.params,
                headers: settings.headers
              }
            )
            .success(function(data, status, headers, config) {
                d.resolve(data);
              })
            .error(function(reason) {
                d.reject(reason);
              });
            return d.promise;
          },
          callExtension: function(extensionName, settings) {
            return this.advancedCall('/v1/resources/'+extensionName, settings);
          }
        };

        return service;
      }];
    });
}());
