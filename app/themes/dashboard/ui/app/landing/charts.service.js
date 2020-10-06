(function () {
  'use strict';

  angular.module('app.landing')
    .factory('chartsService', ChartsService);

  ChartsService.$inject = [];
  function ChartsService() {

    function top10Chart(title, type, xFacet, xLabel, limit, callback) {
      return {
        options: {
          chart: {
            type: type,
            zoomType: 'xy'
          },
          tooltip: {
            style: {
              padding: 10,
              fontWeight: 'bold'
            },
            shared: true,
            crosshairs: true,
            headerFormat: '<b>{series.name}</b><br>',
            pointFormatter: /* istanbul ignore next Unreachable */ function() {
              return (this.xCategory || this.x) + ': <b>' + (this.yCategory || this.y) + '</b><br>';
            }
          },
          legend: {
            enabled: false
          },
          plotOptions: {
            series: {
              cursor: 'pointer',
              point: {
                events: {
                  click: function (e) {
                    var facet = this.series.name;
                    var x = this.xCategory || this.x;
                    var y = this.yCategory || this.y;
                    if (callback) callback(facet, x, y);
                  }
                }
              }
            }
          }
        },
        title: {
          text: title
        },

        xAxis: {
          title: {
            text: xLabel
          },
          labels: (type !== 'bar' ? {
            rotation: -45
          } : {})
        },
        // constraint name for x axis
        //xAxisMLConstraint: xFacet,
        // optional constraint name for categorizing x axis values
        xAxisCategoriesMLConstraint: xFacet,

        // grouping results
        //seriesNameMLConstraint: yFacet,
        //dataPointNameMLConstraint: yFacet,

        yAxis: {
          title: {
            text: 'Frequency'
          }
        },
        // constraint name for y axis ($frequency is special value for value/tuple frequency)
        yAxisMLConstraint: '$frequency',

        // zAxis: {
        //   title: {
        //     text: null
        //   }
        // },
        //zAxisMLConstraint: '$frequency',
        // limit of returned results

        size: {
          height: 250
        },
        resultLimit: limit || /* istanbul ignore next Unreachable */ 10,
        credits: {
          enabled: true
        }
      };
    }

    function top10Chartv2(title, type, xFacet, xLabel, yFacet, yLabel, limit, callback) {
      return {
        options: {
          chart: {
            type: type,
            zoomType: 'xy'
          },
          tooltip: {
            style: {
              padding: 10,
              fontWeight: 'bold'
            },
            shared: false,
            split: true,
            crosshairs: true,
            headerFormat: '<b>{series.name}</b><br>',
            pointFormatter: /* istanbul ignore next Unreachable */ function() {
              return (this.xCategory || this.x) + ': <b>' + (this.yCategory || this.y) + '</b><br>';
            }
          },
          legend: {
            enabled: true
          },
          plotOptions: {
            series: {
              cursor: 'pointer',
              point: {
                events: {
                  click: function (e) {
                    var facet = this.series.name;
                    var x = this.xCategory || this.x;
                    var y = this.yCategory || this.y;
                    if (callback) callback(facet, x, y);
                  }
                }
              }
            }
          }
        },
        title: {
          text: title
        },

        xAxis: {
          title: {
            text: xLabel
          },
          labels: (type !== 'bar' ? {
            rotation: -45
          } : /* istanbul ignore next Unreachable */ {})
        },
        // constraint name for x axis
        // xAxisMLConstraint: xFacet,
        // optional constraint name for categorizing x axis values
        xAxisCategoriesMLConstraint: xFacet,

        // grouping results
        seriesNameMLConstraint: yFacet,
        //dataPointNameMLConstraint: yFacet,

        yAxis: {
          title: {
            text: 'Frequency'
          }
        },
        // constraint name for y axis ($frequency is special value for value/tuple frequency)
        yAxisMLConstraint: '$frequency',

        // zAxis: {
        //   title: {
        //     text: null
        //   }
        // },
        //zAxisMLConstraint: '$frequency',

        size: {
          height: 250
        },
        resultLimit: 0,
        credits: {
          enabled: true
        }
      };
    }

    return {
      top10Chart: top10Chart,
      top10Chartv2: top10Chartv2
    };
  }
}());
