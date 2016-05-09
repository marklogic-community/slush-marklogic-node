(function () {

  var app = angular.module('app');

  app
    .factory('navService', NavigationService)
    .controller('topnavCtrl', TopNavCtrl);

   NavigationService.$injector = ['$rootScope', '$state'];
    function NavigationService($rootScope, $state) {
      var service = {}, links, active, activeLabel, linkAreas = {};

      $rootScope.$on('$stateChangeSuccess', function(evt, target) {
        service.setCurrentState(target);
      });

      service.registerStates = function(states) {
        var s, lbl;

        links = [];
        for (var i = 0; i < states.length; i++) {
          s = states[i];
          lbl = s.navLabel;
          if (lbl) {
            var link = { state: s.name, label: lbl, url: s.url };
            links.push(link);
            // group it if area is specified
            if (lbl.area) {
              if (!linkAreas[lbl.area]) {
                linkAreas[lbl.area] = [];
              }
              linkAreas[lbl.area].push(link);
            }
          }
        }
      };

      service.setCurrentState = function($state) {
        active = $state.name;
        activeLabel = $state.navLabel;
      };

      service.isActive = function(stateName, areaName) {
        return (areaName) ? activeLabel.area === areaName && active === stateName : active === stateName;
      };

      service.getLinks = function(area) {
        var links = area ? linkAreas[area] : links;
        return links;
      };

      service.toXSDateTime = function(jsDate) {
        if (!jsDate) return;
        var xsd = jsDate.toISOString();
        return xsd.slice(0,-1);
        //xsd += '+' + (jsDate.getTimezoneOffset() / 60) + ':00';
        //return xsd;
      };

      // set up the current state in case we missed the event
      if ($state && $state.current) {
        service.setCurrentState($state.current);
      }

      service.gotoLink = function(link) {
        $state.go(link.state);
      };

      return service;
    }

    TopNavCtrl.$injector = ['$scope', 'userService'];
    function TopNavCtrl($scope, userService) {
      var ctrl = this;

      ctrl.currentUser = userService.getUser();

      $scope.$watch(userService.currentUser, function(newValue) {
        ctrl.currentUser = newValue;
      });
    }

})();
