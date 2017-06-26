(function () {
  'use strict';

  angular.module('app.dashboard')
    .directive('contentBox', ContentBoxDirective);

  function ContentBoxDirective() {
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {
        boxTitle: '@',
        boxBordered: '@',
        collapsed: '@'
      },
      link: function($scope, $elem, $attrs) {
        $scope.hasBorder = $scope.boxBordered !== 'false' && $scope.boxBordered !== 'no';

        $scope.toggleCollapsed = function() {
          $scope.isCollapsed = !$scope.isCollapsed;
        };

        $scope.$watch(function() { return $attrs.collapsed; }, function(newVal) {
          newVal = '' + newVal;
          $scope.isCollapsed = newVal === 'true' || newVal === 'yes';
        });
      },
      /* jshint multistr: true */
      /* jscs: disable */
      template: '<div class="box" ng-init="collapsed = collapsed || false">\
        <div class="box-header" ng-class="{ \'with-border\': boxBordered }" ng-if="boxTitle" ng-click="toggleCollapsed()">\
          <h3 class="box-title">{{ boxTitle }}</h3>\
          <div class="box-tools pull-right">\
            <button type="button" class="btn btn-box-tool" ng-hide="isCollapsed"><i class="fa fa-minus"></i></button>\
            <button type="button" class="btn btn-box-tool" ng-show="isCollapsed"><i class="fa fa-plus"></i></button>\
          </div>\
        </div>\
        <div class="box-body" ng-hide="isCollapsed" ng-transclude></div>\
      </div>'
      /* jscs: enable */
    };
  }

})();
