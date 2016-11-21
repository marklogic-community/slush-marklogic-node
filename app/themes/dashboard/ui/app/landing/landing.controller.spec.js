/* jshint -W117, -W030 */
(function () {
  'use strict';

  describe('Controller: LandingCtrl', function () {

    var controller;

    var _user = {
      data: {
        username: 'bob',
        authenticated: true
      }
    };
    var results = [{
      uri: 'abc'
    }, {
      uri: 'def'
    }];

    beforeEach(function() {
      bard.appModule('app.landing');
      bard.inject('$controller', '$rootScope',
        'MLSearchFactory', 'MLRest', '$q');

      bard.mockService(MLRest, {
        search: $q.when({
          data: {
            results: results
          }
        })
      });

    });

    beforeEach(function () {
      controller = $controller('LandingCtrl', {
        $scope: $rootScope.$new(),
        $rootScope: $rootScope,
        MLSearchFactory: MLSearchFactory
      });
      $rootScope.$apply();
    });

    it('should be created successfully', function () {
      expect(controller).to.be.defined;
    });

    it('should run a search at login', function(done) {
      $rootScope.$broadcast('loginService:login-success', {data:_user});
      $rootScope.$apply(controller);
      done();
      expect(controller.mlSearch.results.results).to.eq(results);
    });

    it('should succeed twice', function(done) {
      $rootScope.$broadcast('loginService:login-success', {data:_user});
      $rootScope.$apply(controller);
      done();
      $rootScope.$broadcast('loginService:login-success', {data:_user});
      $rootScope.$apply(controller);
      done();
      expect(controller.mlSearch.results.results).to.eq(results);
      // mostly for code coverage
    });

    it('should flush results at logout', function(done) {
      $rootScope.$broadcast('loginService:logout-success');
      $rootScope.$apply(controller);
      done();
      expect(controller.mlSearch).to.eq(null);
    });
  });
}());
