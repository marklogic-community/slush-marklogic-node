(function() {
  'use strict';

  angular.module('app.landing')
    .controller('LandingCtrl', LandingCtrl);

  LandingCtrl.$inject = ['$rootScope', '$scope', '$location', 'MLSearchFactory'];

  function LandingCtrl($rootScope, $scope, $location, searchFactory) {

    var ctrl = this;

    angular.extend(ctrl, {
      eyeColor: top10Chart('Eye Color', 'pie', 'eyeColor', 'Eye Color', 50),
      gender: top10Chart('Gender', 'bar', 'gender', 'Gender', 50),
      combined: top10Chartv2('Eye Color vs Gender', 'column', 'eyeColor', 'Eye Color',
                  'gender', 'Gender')
    });

    $rootScope.$on('loginService:login-success', function(e, user) {
      if (!ctrl.mlSearch) {
        ctrl.mlSearch = searchFactory.newContext();
      }
      ctrl.mlSearch.search(); // trigger showing of charts
    });

    $rootScope.$on('loginService:logout-success', function() {
      ctrl.mlSearch = null; // hide charts
    });

  }

  function top10Chart(title, type, xFacet, xLabel, limit) {
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
          headerFormat: '<b>{series.name}</b><br/>',
          pointFormatter: function() {
            return (this.xCategory || this.x) + ': <b>' + (this.yCategory || this.y) + '</b><br/>';
          }
        },
        legend: {
          enabled: false
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
      resultLimit: limit || 10,
      credits: {
        enabled: true
      }
    };
  }

  function top10Chartv2(title, type, xFacet, xLabel, yFacet, yLabel, limit) {
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
          headerFormat: '<b>{series.name}</b><br/>',
          pointFormatter: function() {
            return (this.xCategory || this.x) + ': <b>' + (this.yCategory || this.y) + '</b><br/>';
          }
        },
        legend: {
          enabled: true
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
}());
