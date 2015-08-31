/* jshint -W117, -W030 */
(function () {
  'use strict';

  describe('Controller: DetailCtrl', function () {

    var controller;
    var doc;

    beforeEach(function() {
      bard.appModule('app.detail');
      bard.inject('$controller', '$rootScope');
    });

    beforeEach(function () {
      // stub the document
      doc = {
        name: 'hi'
      };
      controller = $controller('DetailCtrl', { doc: doc });
      $rootScope.$apply();
    });

    it('should be created successfully', function () {
      expect(controller).to.be.defined;
    });

    it('should have the doc we gave it', function() {
      expect(controller.doc).to.eq(doc);
    });

  });
}());
