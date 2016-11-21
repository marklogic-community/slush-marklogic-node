(function () {
  'use strict';

  angular.module('app.navigation')
    .factory('navService', NavigationService);

  NavigationService.$injector = ['$rootScope', '$state'];

  function NavigationService($rootScope, $state) {
    var service = {}, links, active, activeLabel, linkAreas = {};

    $rootScope.$on('$stateChangeSuccess', function(evt, target) {
      service.setCurrentState(target);
    });

    service.registerStates = function(states) {
      var s, lbl;

      links = [];
      linkAreas = {};
      for (var i = 0; i < states.length; i++) {
        s = states[i];
        lbl = s.navLabel || { text: s.name };

        var link = { state: s.name, label: lbl , url: s.url };
        links.push(link);
        // group it if area is specified
        if (lbl.area) {
          if (!linkAreas[lbl.area]) {
            linkAreas[lbl.area] = [];
          }
          linkAreas[lbl.area].push(link);
        }
      }
    };

    service.setCurrentState = function($state) {
      active = $state.name;
      activeLabel = $state.navLabel;
    };

    service.isActive = function(stateName, areaName) {
      return areaName ?
        (activeLabel.area === areaName && active === stateName) :
          (active === stateName);
    };

    service.getLinks = function(area) {
      return area ? linkAreas[area] : links;
    };

    // TODO: redundant code?
    // service.toXSDateTime = function(jsDate) {
    //   if (!jsDate) {
    //     return;
    //   }
    //   var xsd = jsDate.toISOString();
    //   return xsd.slice(0, -1);
    //   //xsd += '+' + (jsDate.getTimezoneOffset() / 60) + ':00';
    //   //return xsd;
    // };

    // set up the current state in case we missed the event
    if ($state && $state.current) {
      service.setCurrentState($state.current);
    }

    service.gotoLink = function(link) {
      $state.go(link.state);
    };

    service.showSidebar = true;

    service.toggleSidebar = function () {
      service.showSidebar = !service.showSidebar;
    };

    return service;
  }

})();
