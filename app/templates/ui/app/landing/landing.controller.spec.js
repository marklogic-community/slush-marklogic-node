/* jshint -W117, -W030 */
(function () {
  'use strict';

  describe('Controller: LandingCtrl', function () {

    var controller;

    beforeEach(function() {
      bard.appModule('app.landing');
      bard.inject('$controller', '$rootScope');
    });

    beforeEach(function () {
      controller = $controller('LandingCtrl', {
        $scope: $rootScope.$new()
      });
      $rootScope.$apply();
    });

    it('should be created successfully', function () {
      expect(controller).to.be.defined;
    });

  });
}());
