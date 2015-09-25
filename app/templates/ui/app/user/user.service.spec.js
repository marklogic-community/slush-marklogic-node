/* jshint -W117, -W030 */
(function () {
  'use strict';

  describe('Service: userService', function () {

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

    });

    beforeEach(inject(function (_userService_) {
      service = _userService_;
    }));

    it('should be defined', function () {
      expect(service).to.be.defined;
    });

    it('currentUser should not be defined', function () {
      expect(service.currentUser()).to.not.be.defined;
    });

    it('should get the current logged in user - if loginService not init', function () {
      service.getUser().then(function(user) {
        expect(user).to.deep.eq({ name: 'bob' });
      });
      expect($http.get).to.have.been.calledOnce;
      $rootScope.$apply();
    });

    it('should set user with valid credentials', function () {
      loginService.login('test', 'abc').then(function(response) {
        expect(response.data).to.deep.eq({ authenticated: true, username: 'bob' });
        expect(service.currentUser()).to.deep.eq({ name: 'bob' });
        expect(service.getUser()).to.deep.eq({ name: 'bob' });
      });
      expect($http.post).to.have.been.calledOnce;
      $rootScope.$apply();
    });

    it('should not set user with invalid credentials', function () {
      _user.data.authenticated = false;
      loginService.login('test', 'abcd').then(function(response) {
        expect(response.data.authenticated).to.be.false;
        expect(service.currentUser()).to.not.be.defined;
      });
      expect($http.post).to.have.been.calledOnce;
      $rootScope.$apply();
    });

    it('should clear user after logout', function () {
      expect(service.currentUser()).to.not.be.defined;
      _user.data.authenticated = true;
      loginService.login('test', 'abcd').then(function(response) {
        expect(response.data).to.deep.eq({ authenticated: true, username: 'bob' });
        expect(service.currentUser()).to.deep.eq({ name: 'bob' });

        loginService.logout().then(function(response) {
          expect(loginService.isAuthenticated()).to.be.false;
          expect(service.currentUser()).to.not.be.defined;
        });
      });

      $rootScope.$apply();
    });
  });
}());
