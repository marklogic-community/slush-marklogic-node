/* jshint -W117, -W030 */
(function () {
  'use strict';

  describe('Service: mapUtils', function () {

    var service;

    beforeEach(function() {
      bard.appModule('app.map');
    });

    beforeEach(inject(function (_mapUtils_) {
      service = _mapUtils_;
    }));

    it('should be defined', function () {
      expect(service).to.be.defined;
    });

    it('should check isMobile', function () {
      expect(service.isMobile()).to.eq(true);
    });

  });
}());
