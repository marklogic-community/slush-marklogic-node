/* jshint -W117, -W030 */
(function () {
  'use strict';

  describe('Controller: LandingCtrl', function () {

    var controller;

    var currentUser = null;
    var _user = {
      data: {
        username: 'bob',
        authenticated: true
      }
    };

    var results = [
      {
        uri: 'abc'
      },
      {
        uri: 'def'
      }
    ];

    beforeEach(function() {
      bard.appModule('app.landing');
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
      controller = $controller('LandingCtrl', { $scope: $rootScope.$new() });
      $rootScope.$apply();
    });

    it('should be created successfully', function () {
      expect(controller).to.be.defined;
    });

    it('currentUser should not be defined', function() {
      expect(controller.currentUser).to.not.be.defined;
    });

    it('should update the current user when logged in using loginService', function(done) {
      $rootScope.$broadcast('loginService:login-success', {data:_user});
      $rootScope.$apply(controller);

      done();
      expect(controller.currentUser().name).to.eq('bob');
    });

    it('should run a search at login', function() {
      expect(controller.mlSearch.results.results).to.eq(results);
    });
  });
}());
