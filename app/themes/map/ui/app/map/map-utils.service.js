(function () {
  'use strict';

  angular.module('app.map')
    .service('mapUtils', MapUtilsFactory);

  function MapUtilsFactory() {
    var service = {}, width = window.innerWidth;

    service.isMobile = function() {
      return service.isXS() || service.isSM();
    };

    service.isXS = function() {
      return width < 768; // match boostrap xs
    };

    service.isSM = function() {
      return width < 992; // match bootrap sm
    };

    return service;
  }

})();
