/* global MLSearchController */
(function () {
  'use strict';

  angular.module('app.landing')
    .controller('LandingCtrl', LandingCtrl);

  LandingCtrl.$inject = ['$scope'
    , '$location'
    , 'userService'
    , 'MLSearchFactory'
    , 'HighchartsHelper'];

  function LandingCtrl($scope
    , $location
    , userService
    , searchFactory
    , highchartsHelper) {

    var ctrl = this;
    ctrl.mlSearch = searchFactory.newContext();

    angular.extend(ctrl, {
      "eyeColor" : top10Chart('Eye Color'
        , 'pie'
        , 'eyeColor'
        , 'Eye Color'
        , 50)
      , "gender" : top10Chart('Gender'
        , 'column'
        , 'gender'
        , 'Gender'
        , 50)
      , "combined" : top10Chartv2('Eye Color vs Gender'
        , 'bar'
        , 'eyeColor'
        , 'Eye Color'
        , 'gender'
        , 'Gender')
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
      yAxis: {
        title: {
          text: 'Frequency'
        }
      },
      // constraint name for y axis ($frequency is special value for value/tuple frequency)
      yAxisMLConstraint: '$frequency',
      zAxis: {
        title: {
          text: null
        }
      },
      // limit of returned results
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
          shared: true,
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
      xAxisCategoriesMLConstraint: xFacet,

      yAxis: {
        title: {
          text: 'Frequency'
        }
      },
      // constraint name for y axis ($frequency is special value for value/tuple frequency)
      yAxisMLConstraint: '$frequency',

      zAxis: {
        title: {
          text: yLabel
        }
      },
      // constraint name for x axis
      // xAxisMLConstraint: xFacet,
      // optional constraint name for categorizing x axis values
      seriesNameMLConstraint: yFacet,
      // dataPointNameMLConstraint: yFacet,

      // limit of returned results
      resultLimit: limit || 10,
      credits: {
        enabled: true
      }
    };
  }
}());
