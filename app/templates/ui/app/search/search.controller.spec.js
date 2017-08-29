/* jshint -W117, -W030 */
(function () {
  'use strict';

  describe('Controller: SearchCtrl', function () {

    var controller;

    var results = [
      {
        uri: 'abc'
      },
      {
        uri: 'def'
      }
    ];

    beforeEach(function() {
      bard.appModule('app.search');
      bard.inject('$controller', '$q', '$rootScope', '$location',
        'MLSearchFactory', 'MLRest');

      bard.mockService(MLRest, {
        search: $q.when({
          data: {
            results: results
          }
        }),
        queryConfig: $q.when({
          data: {
            options: {
              operator: []
            }
          }
        })
      });

    });

    beforeEach(function () {
      controller = $controller('SearchCtrl', { $scope: $rootScope.$new() });
      $rootScope.$apply();
    });

    it('should be created successfully', function () {
      expect(controller).to.be.defined;
    });

    // TODO: needs to run on login-success event..
    // it('should update the current user if it changes', function() {
    //   expect(controller.currentUser).to.not.be.defined;
    // });

    it('should run an initial search', function() {
      expect(controller.response.results).to.eq(results);
    });

    it('should run a search', function() {
      controller.response = null;
      controller.search('stuff');
      $rootScope.$apply();
      expect(controller.response.results).to.eq(results);
    });

    it('should search on snippet change', function() {
      controller.response = null;
      controller.setSnippet('my-snippet');
      $rootScope.$apply();
      expect(controller.response.results).to.eq(results);
    });
  });
}());
