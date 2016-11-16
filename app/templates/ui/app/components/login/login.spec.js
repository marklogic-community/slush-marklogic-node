/* jshint -W117, -W030 */
import Module from './login';

import Controller from './login.controller';
import Component from './login.component';
import Template from './login-component.html';

describe('app.login', () => {
  let modalOpened = false;
  let _user = {
    data: {
      username: 'bob',
      authenticated: true
    }
  };

  beforeEach(bard.appModule(Module));

  beforeEach(() => {
    bard.inject('$q', '$http', '$uibModal', '$rootScope', '$state', '$stateParams');

    bard.mockService($http, {
      _default: $q.when([]),
      get: $q.when(_user)
    });

    bard.mockService($state, {
      current: {
        name: 'root.search',
        params: {}
      },
      go: function(stateName, stateParams) {
        this.current = {
          name: stateName,
          params: stateParams
        };
        return $q.when();
      }
    });

    bard.mockService($uibModal, {
      open: function() {
        modalOpened = true;
        return {
          result: angular.noop
        };
      }
    });

  });

  describe('Service: loginService', () => {

    let service;

    beforeEach(inject(($injector) => {
      service = $injector.get('loginService');

      modalOpened = false;
    }));

    it('should be defined', function() {
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

  describe('Service: loginService - should be authenticated if logged in already', function() {

    let service;

    beforeEach(inject(($injector) => {
      service = $injector.get('loginService');

      modalOpened = false;
    }));

    //needs to be present for logged in already test
    afterEach(inject(($rootScope) => {
      $rootScope.$apply();
    }));

    it('should be defined', () => {
      expect(service).to.be.defined;
    });

    it('should be logged in already', () => {
      expect(service.isAuthenticated()).to.be.not.defined;

      let isLoggedIn = false;
      service.getAuthenticatedStatus($rootScope).then((done) => {
        isLoggedIn = service.isAuthenticated();
        expect(isLoggedIn).to.eq(true);
      });

    });
  });

  describe('Controller', () => {

    // controller specs
    let controller, loginService;

    let $componentController;

    beforeEach(inject(($injector) => {
      $componentController = $injector.get('$componentController');
      loginService = $injector.get('loginService');

      modalOpened = false;
    }));

    beforeEach(() => {
      controller = $componentController('login', {
        $scope: $rootScope.$new()
      });
    });

    // controller specs
    it('Controller calls login Service', function() {
      controller.username = 'user';
      controller.password = 'pass';
      let loginMock = sinon.stub(loginService, 'login').returns($q.when({}));

      controller.login();

      loginMock.restore();

      expect(loginMock.calledWith('user', 'pass')).to.eq(true);
    });
  });

  describe('View', () => {
    // view layer specs.
    let scope, template, $compile;

    beforeEach(inject(($injector) => {
      $compile = $injector.get('$compile');
    }));

    beforeEach(() => {
      scope = $rootScope.$new();

      template = $compile('<login></login>')(scope);
      scope.$apply();
    });

    it('Invalid Username from empty scope', () => {
      expect(template.find('div')[1].innerHTML).to.eq('Username and/or Password Incorrect');
    });
  });

  describe('Component', () => {
    // component/directive specs
    let component = Component;

    it('includes the intended template', () => {
      expect(component.template).to.equal(Template);
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(Controller);
    });
  });

});
