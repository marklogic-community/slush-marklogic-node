/* jshint -W117, -W030 */
import Module from './user';

import Component from './mlUser.component';
import Template from './user-component.html';

describe('app.user', () => {

  var service;
  var _user = {
    data: {
      username: 'bob',
      authenticated: true
    }
  };

  beforeEach(bard.appModule(Module));

  beforeEach(function() {
    bard.inject('$q', '$http', '$rootScope', '$state', 'loginService');

    bard.mockService($http, {
      _default: $q.when([]),
      get: $q.when(_user),
      post: $q.when(_user)
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
      },
      reload: function() {
        return $q.when();
      }
    });

    sinon.stub(loginService, 'getAuthenticatedStatus').returns($q.when());
  });

  beforeEach(inject(($injector) => {
    service = $injector.get('userService');
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
    $rootScope.$broadcast('loginService:login-success', {
      data: _user
    });
    $rootScope.$apply(service);

    done();
    expect(service.currentUser().name).to.eq('bob');
  });

  it('should not set user with invalid credentials', function() {
    _user.data.authenticated = false;
    $rootScope.$broadcast('loginService:login-success', {
      data: _user
    });
    $rootScope.$apply(service);

    expect(service.currentUser().name).to.eq(undefined);
  });

  it('should clear user after logout', function() {
    $rootScope.$broadcast('loginService:logout-success');
    $rootScope.$apply(service);

    expect(service.currentUser()).to.not.be.defined;
  });

  describe('View', () => {
    // view layer specs.
    let scope, template, $compile;

    beforeEach(inject(($injector) => {
      $compile = $injector.get('$compile');
    }));

    beforeEach(() => {
      scope = $rootScope.$new();

      template = $compile('<ml-user></ml-user>')(scope);
      scope.$apply();
    });

    it('Show Login button for login mode', () => {
      expect(template.find('a')[0].innerHTML).to.eq('Login');
    });
  });

  describe('Component', () => {
    // component/directive specs
    let component = Component;

    it('includes the intended template', () => {
      expect(component.template).to.equal(Template);
    });
  });

});
