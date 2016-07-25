/* jshint -W117, -W030 */
(function() {
  'use strict';

  describe('Controller: DetailCtrl', function() {

    var controller;
    var doc;

    beforeEach(function() {
      bard.appModule('app.detail');
      bard.inject('$controller', '$rootScope');

      // stub the document
      var headers = function() {
        return 'application/json'; };
      doc = {
        headers: headers,
        data: {
          name: 'hi',
          location: {
            latitude: 1,
            longitude: 2
          }
        }
      };
      controller = $controller('DetailCtrl', { doc: doc });
      $rootScope.$apply();
    });

    it('should be created successfully', function() {
      expect(controller).to.be.defined;
    });

    it('should have the doc data we gave it', function() {
      expect(controller.doc).to.eq(doc.data);
    });

  });
}());
