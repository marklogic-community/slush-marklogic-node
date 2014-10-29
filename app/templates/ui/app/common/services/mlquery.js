
/*
  Library to use (close to) fluent-style notation to build structured MarkLogic queries..

  This:

    {
      'or-query': {
        'queries': [
          {
            'range-constraint-query': {
              'constraint-name': 'PublishedDate',
              'range-operator': 'LE',
              'value': new Date().toISOString(),
              'range-option': ['score-function=reciprocal','slope-factor=50']
            }
          },
          {
            'and-query': {
              'queries': []
            }
          }
        ]
      }
    }

  Becomes:

    qb.orQuery(
      qb.rangeConstraintQuery(
        'PublishedDate', 'LE', new Date().toISOString(),
        ['score-function=reciprocal','slope-factor=50']
      ),
      qb.andQuery()
    )

  This:

    {
      'or-query': {
        'queries': [{
          'geospatial-constraint-query': {
            'constraint-name': 'meridian-geo',
            'box': [
              bounds
            ]
          }
        },{
          'geospatial-constraint-query': {
            'constraint-name': 'connect-geo',
            'box': [
              bounds
            ]
          }
        }]
      }
    }

  Becomes:

    qb.orQuery(
      qb.geospatialConstraintQuery('meridian-geo', [bounds]),
      qb.geospatialConstraintQuery('connect-geo', [bounds]),
    )

*/

(function() {
  'use strict';

  angular.module('sample.common')
    .factory('MLSampleQueryBuilder', [function() {
      var andQuery = function () {
        if (arguments.length === 1 && angular.isArray(arguments[0])) {
          return {
            'and-query': {
              'queries': arguments[0]
            }
          };
        } else {
          return {
            'and-query': {
              'queries': Array.prototype.slice.call(arguments)
            }
          };
        }
      };
      return {
        andQuery: andQuery,
        boostQuery: function (matchingQuery, boostingQuery) {
          if (matchingQuery) {
            return {
              'boost-query': {
                'matching-query': matchingQuery,
                'boosting-query': boostingQuery
              }
            };
          } else {
            return {
              'boost-query': {
                'matching-query': andQuery(),
                'boosting-query': boostingQuery
              }
            };
          }
        },
        collectionConstraintQuery: function (constraintName, uris) {
          return {
            'collection-constraint-query': {
              'constraint-name': constraintName,
              'uri': Array.isArray(uris) ? uris : [ uris ]
            }
          };
        },
        customConstraintQuery: function (constraintName, terms) {
          return {
            'custom-constraint-query': {
              'constraint-name': constraintName,
              'text': terms
            }
          };
        },
        customGeospatialConstraintQuery: function (constraintName, annotation, box) {
          return {
            'custom-constraint-query': {
              'constraint-name': constraintName,
              'annotation': annotation,
              'box': box
            }
          };
        },
        documentQuery: function (uris) {
          return {
            'document-query': {
              'uri': Array.isArray(uris) ? uris : [ uris ]
            }
          };
        },
        geospatialConstraintQuery: function (constraintName, boxes) {
          return {
            'geospatial-constraint-query': {
              'constraint-name': constraintName,
              'box': boxes
            }
          };
        },
        operatorState: function (operatorName, stateName) {
          return {
            'operator-state': {
              'operator-name': operatorName,
              'state-name': stateName
            }
          };
        },
        orQuery: function () {
          if (arguments.length === 1 && angular.isArray(arguments[0])) {
            return {
              'or-query': {
                'queries': arguments[0]
              }
            };
          } else {
            return {
              'or-query': {
                'queries': Array.prototype.slice.call(arguments)
              }
            };
          }
        },
        propertiesQuery: function (query) {
          return {
            'properties-query': query
          };
        },
        rangeConstraintQuery: function (constraintName, rangeOperator, value, rangeOptions) {
          if (!rangeOptions) {
            rangeOptions = [];
          }
          if (!rangeOperator) {
            rangeOperator = 'EQ';
          }
          return {
            'range-constraint-query': {
              'constraint-name': constraintName,
              'range-operator': rangeOperator,
              'value': value,
              'range-option': rangeOptions
            }
          };
        },
        structuredQuery: function() {
          if (arguments.length === 1 && angular.isArray(arguments[0])) {
            return {
              'query': {
                'queries': arguments[0]
              }
            };
          } else {
            return {
              'query': {
                'queries': Array.prototype.slice.call(arguments)
              }
            };
          }
        },
        termQuery: function (terms, weight) {
          if (weight) {
            return {
              'term-query': {
                'text': terms,
                'weight': weight
              }
            };
          } else {
            return {
              'term-query': {
                'text': terms
              }
            };
          }
        },
        textQuery: function (text) {
          return {
            'qtext': text
          };
        }
      };
    }]);
}());
