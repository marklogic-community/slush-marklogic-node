/* jshint -W117, -W030 */
(function () {
  'use strict';

  describe('Controller: DetailCtrl', function () {

    var controller1, controller2, controller3, controller4, controller5;
    var xmldoc, jsondoc, txtdoc, bindoc, otherdoc;

    beforeEach(function() {
      bard.appModule('app.detail');
      bard.inject('$controller', '$rootScope', 'MLRest', '$q');

      bard.mockService(MLRest, {
        deleteDocument: function() {
          return $q.when(arguments[0].uri);
        }
      });
    });

    beforeEach(function () {
      // xml
      xmldoc = {
        headers: function() { return 'application/xml'; },
        data: '<xml><name>hi</name></xml>'
      };
      controller1 = $controller('DetailCtrl', {
        doc: xmldoc,
        $scope: $rootScope.$new(),
        $stateParams: { uri: '/doc.xml' }
      });

      // json
      jsondoc = {
        headers: function() { return 'application/json'; },
        data: {
          name: 'hi'
        }
      };
      controller2 = $controller('DetailCtrl', {
        doc: jsondoc,
        $scope: $rootScope.$new(),
        $stateParams: { uri: '/doc.json' }
      });

      // txt
      txtdoc = {
        headers: function() { return 'text/plain'; },
        data: 'hi'
      };
      controller3 = $controller('DetailCtrl', {
        doc: txtdoc,
        $scope: $rootScope.$new(),
        $stateParams: { uri: '/doc.txt' }
      });

      // bin
      bindoc = {
        headers: function() { return 'application/pdf'; },
        data: 'xxxx'
      };
      controller4 = $controller('DetailCtrl', {
        doc: bindoc,
        $scope: $rootScope.$new(),
        $stateParams: { uri: '/doc.pdf' }
      });

      // unknown
      otherdoc = {
        headers: function() { return 'unknown'; },
        data: 'xxxx'
      };
      controller5 = $controller('DetailCtrl', {
        doc: otherdoc,
        $scope: $rootScope.$new(),
        $stateParams: { uri: '/doc.other' }
      });

      $rootScope.$apply();
    });

    it('should be created successfully', function () {
      expect(controller1).to.be.defined;
      expect(controller2).to.be.defined;
      expect(controller3).to.be.defined;
      expect(controller4).to.be.defined;
      expect(controller5).to.be.defined;
    });

    it('should have the doc data we gave it', function() {
      expect(controller1.doc).to.eq(xmldoc.data);
      expect(controller2.doc).to.eq(jsondoc.data);
      expect(controller3.doc).to.eq(txtdoc.data);
      expect(controller4.doc).to.eq(bindoc.data);
      expect(controller5.doc).to.eq(otherdoc.data);
    });

    it('should delete docs', function() {
      controller1.delete();
      controller2.delete();
      controller3.delete();
      controller4.delete();
      controller5.delete();
      // no expects, just for code coverage
      // TODO: then branch of deleteDocument not reached according code coverage??
    });

  });
}());
