(function () {
    var app = angular.module('app');

    app.directive('contentBox', ContentBoxDirective);

    function ContentBoxDirective() {
      return {
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: {
          boxTitle: '@',
          boxBordered: '@'
        },
        link: function(scope) {
          scope.hasBorder = scope.boxBordered !== 'false' && scope.boxBordered !== 'no';

          scope.$watch(scope.boxTabs, function(newVal) {
            if (newVal) {
              scope.hasTabs = true;
            } else {
              scope.hasTabs = false;
            }
          });
        },
        template: '<div class="box">\
          <div class="box-header" ng-class="{ \'with-border\': boxBordered }" ng-if="boxTitle"><h3 class="box-title">{{ boxTitle }}</h3></div>\
          <div class="box-body" ng-transclude></div>\
        </div>'
      };
  }

})();
