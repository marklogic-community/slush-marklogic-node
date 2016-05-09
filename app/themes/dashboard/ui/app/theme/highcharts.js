(function () {
    var app = angular.module('app');

    // overly simplified highcharts directive for drawing charts in a sized containing element
    app.directive('highcharts',HighchartsDirective);

    function HighchartsDirective() {
      return {
        restrict: 'A',
        scope: {
          chartSeries: '=',
          seriesData: '=',
          chartOptions: '='
        },
        link: function(scope,element) {

          scope.chart = {};

          scope.$watch('chartOptions', function(newVal) {
            if (newVal) {
              if (!newVal.series) {
                newVal.series = scope.chartSeries || [];
              }
              scope.chart = angular.element(element).highcharts(newVal);
            }
          });

          scope.$watch('seriesData', function(newVal, oldVal) {
            if (newVal) {
              scope.chart = angular.element(element).highcharts();
              scope.chart.series[0].setData(newVal, true);
            }
          });
        }
      };
    }
})();
