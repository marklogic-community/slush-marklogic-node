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
      bard.inject('$q', '$http', '$rootScope');

      bard.mockService($http, {
        _default: $q.when([]),
        get: $q.when(_user)
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

    it('should get the current logged in user', function () {
      service.getUser().then(function(user) {
        expect(user).to.deep.eq({ name: 'bob' });
      });
      expect($http.get).to.have.been.calledOnce;
      $rootScope.$apply();
    });

    it('should logon with valid credentials', function () {
      service.login('test', 'abc').then(function(user) {
        expect(user).to.deep.eq({ name: 'bob' });
        expect(service.currentUser()).to.deep.eq({ name: 'bob' });
      });
      expect($http.get).to.have.been.calledOnce;
      $rootScope.$apply();
    });

    it('should not logon with invalid credentials', function () {
      _user.data.authenticated = false;
      service.login('test', 'abcd').then(function(user) {
        expect(user).to.be.a('null');
      });
      expect($http.get).to.have.been.calledOnce;
      $rootScope.$apply();
    });

    it('should logout', function () {
      expect(service.currentUser()).to.not.be.defined;
      _user.data.authenticated = true;
      service.login('test', 'abcd').then(function(user) {
        expect(user).to.deep.eq({ name: 'bob' });
        expect(service.currentUser()).to.deep.eq({ name: 'bob' });

        service.logout().then(function(user) {
          expect(user).to.be.a('null');
          expect(service.currentUser()).to.not.be.defined;
        });
      });

      $rootScope.$apply();
    });
  });
}());
