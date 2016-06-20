/* jshint -W117, -W030 */
(function() {
  'use strict';

  describe('Service: userService', function() {

    var service;
    var _user = {
      data: {
        username: 'bob',
        authenticated: true
      }
    };

    beforeEach(function() {
      bard.appModule('app.user');
      bard.inject('$q', '$http', '$rootScope', '$state', 'loginService');

      bard.mockService($http, {
        _default: $q.when([]),
        get: $q.when(_user),
        post: $q.when(_user)
      });

      bard.mockService($state, {
        current: { name: 'root.search', params: {} },
        go: function(stateName, stateParams) {
          this.current = { name: stateName, params: stateParams };
          return $q.when();
        },
        reload: function() {
          return $q.when();
        }
      });

      bard.mockService(loginService, {
        getAuthenticatedStatus: $q.when()
      });

    });

    beforeEach(inject(function(_userService_) {
      service = _userService_;
    }));

    it('should be defined', function() {
      expect(service).to.be.defined;
    });

    it('currentUser should not be defined', function() {
      expect(service.currentUser()).to.not.be.defined;
    });

    it('should get the current logged in user - if loginService not init', function() {
      service.getUser().then(function(user) {
        expect(user).to.deep.eq(null);
      });

      expect(loginService.getAuthenticatedStatus).to.have.been.calledOnce;

      $rootScope.$apply();
    });

    it('should update the current user when logged in using loginService', function(done) {
      $rootScope.$broadcast('loginService:login-success', {data:_user});
      $rootScope.$apply(service);

      done();
      expect(service.currentUser().name).to.eq('bob');
    });

    it('should not set user with invalid credentials', function () {
      _user.data.authenticated = false;
      $rootScope.$broadcast('loginService:login-success', {data:_user});
      $rootScope.$apply(service);

      expect(service.currentUser().name).to.eq(undefined);
    });

    it('should clear user after logout', function () {
      $rootScope.$broadcast('loginService:logout-success');
      $rootScope.$apply(service);

      expect(service.currentUser()).to.not.be.defined;
    });
  });
}());
