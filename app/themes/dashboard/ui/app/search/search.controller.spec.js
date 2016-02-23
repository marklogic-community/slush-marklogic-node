/* jshint -W117, -W030 */
(function () {
  'use strict';

  describe('Controller: SearchCtrl', function () {

    var controller;

    var currentUser = null;

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
        'userService', 'MLSearchFactory', 'MLRest');

      bard.mockService(userService, {
        currentUser: $q.when(currentUser)
      });

      bard.mockService(MLRest, {
        search: $q.when({
          data: {
            results: results
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

    it('should update the current user if it changes', function() {
      expect(controller.currentUser).to.not.be.defined;
    });

    it('should run a search', function() {
      controller.search('stuff');
      $rootScope.$apply();
      expect(controller.response.results).to.eq(results);
    });
  });
}());
