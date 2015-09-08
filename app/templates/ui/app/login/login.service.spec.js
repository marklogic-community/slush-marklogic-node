/* jshint -W117, -W030 */
(function () {
  'use strict';

  describe('Service: loginService', function () {

    var service;
    var modalOpened = false;
    var _user = {
      data: {
        username: 'bob',
        authenticated: true
      }
    };

    beforeEach(function() {
      bard.appModule('app.login');
      bard.inject('$q', '$http', '$modal', '$rootScope', '$state', '$stateParams');

      bard.mockService($http, {
        _default: $q.when([]),
        get: $q.when(_user)
      });

      bard.mockService($state, {
        current: { name: 'root.search', params: {} },
        go: function(stateName, stateParams) {
          this.current = { name: stateName, params: stateParams };
          return $q.when();
        }
      });

      bard.mockService($modal, {
        open: function() {
          modalOpened = true;
          return { result: angular.noop };
        }
      });

    });

    beforeEach(inject(function (_loginService_) {
      service = _loginService_;

      modalOpened = false;
    }));

    it('should be defined', function () {
      expect(service).to.be.defined;
    });

    it('should open modal if mode is "modal"', function() {
      service.loginMode('modal');
      service.loginPrompt();
      expect(modalOpened).to.be.true;
    });

    it('should go to login page if mode is "full"', function() {
      service.loginMode('full');
      service.loginPrompt();
      expect($state.current.name).to.be.equal('root.login');
    });

    it('should not go to login page if mode is "modal"', function() {
      service.loginMode('modal');
      service.loginPrompt();
      expect($state.current.name).not.to.be.equal('root.login');
    });
  });

  describe('Service: loginService - should be authenticated if logged in already', function () {

    var service;
    var modalOpened = false;
    var _user = {
      data: {
        username: 'bob',
        authenticated: true
      }
    };

    beforeEach(function() {
      bard.appModule('app.login');
      bard.inject('$q', '$http', '$modal', '$rootScope', '$state', '$stateParams');

      bard.mockService($http, {
        _default: $q.when([]),
        get: $q.when(_user)
      });

      bard.mockService($state, {
        current: { name: 'root.search', params: {} },
        go: function(stateName, stateParams) {
          this.current = { name: stateName, params: stateParams };
          return $q.when();
        }
      });

      bard.mockService($modal, {
        open: function() {
          modalOpened = true;
          return { result: angular.noop };
        }
      });

    });

    beforeEach(inject(function (_loginService_) {
      service = _loginService_;

      modalOpened = false;
    }));

    it('should be defined', function () {
      expect(service).to.be.defined;
    });

    it('should be logged in already', function() {
      expect(service.isAuthenticated()).to.be.not.defined;
      service.getAuthenticatedStatus().then(function(done) {
        expect(done).to.be.eq(100);
      });
      fail('');
    });
  });
}());
