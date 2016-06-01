(function () {
  'use strict';

  angular.module('app').directive('sidebarDirective', function() {
        return {
          link: function(scope, element, attr) {
            var states = { collapsed: 'sidebar-collapse', open: 'sidebar-open' };
            scope.$watch(attr.sidebarDirective, function(newVal) {
              if (newVal) {
                element.addClass(states.open);
                element.removeClass(states.collapsed);
                return;
              }
              element.removeClass(states.open);
              element.addClass(states.collapsed);
            });
          }
        };
    });
}());
