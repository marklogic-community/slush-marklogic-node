/* jshint -W117, -W030 */
import Module from './profile';

import Controller from './profile.controller';
import Component from './profile.component';
import Template from './profile.html';

describe('app.profile', () => {

  let $rootScope, controller, $componentController, $compile;
  let $q, MLRest;
  let $state, userService;

  let currentUser = {
    emails: []
  };

  let currentState;

  beforeEach(bard.appModule(Module));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    $compile = $injector.get('$compile');

    MLRest = $injector.get('MLRest');
    $state = $injector.get('$state');
    userService = $injector.get('userService');

    $q = $injector.get('$q');

    bard.mockService(MLRest, {
      _default: $q.when([]),
      updateDocument: $q.when()
    });

    bard.mockService(userService, {
      currentUser: function() {
        return currentUser;
      }
    });

    bard.mockService($state, {
      go: function(s) {
        currentState = s;
      }
    });

  }));

  beforeEach(() => {
    controller = $componentController('profile', {
      $scope: $rootScope.$new()
    });
    $rootScope.$apply();
  });

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
  });

  describe('Controller', () => {
    // controller specs
    it('should be created successfully', function() {
      expect(controller).to.be.defined;
    });

    it('should not add a blank email', function() {
      var newEmail = '';
      controller.newEmail = newEmail;
      expect(controller.user.emails.length).to.eq(0);
      controller.addEmail();
      $rootScope.$apply();
      expect(controller.user.emails.length).to.eq(0);
    });

    it('should add a nonblank email', function() {
      var newEmail = 'test@test.com';
      controller.newEmail = newEmail;
      expect(controller.user.emails.length).to.eq(0);
      controller.addEmail();
      $rootScope.$apply();
      expect(controller.user.emails.length).to.eq(1);
      expect(controller.user.emails[0]).to.eq(newEmail);
    });

    it('should remove an email', function() {
      controller.user.emails = [
        'abc@def.com',
        'def@ghi.com'
      ];

      expect(controller.user.emails.length).to.eq(2);
      controller.removeEmail(1);
      $rootScope.$apply();
      expect(controller.user.emails.length).to.eq(1);
      expect(controller.user.emails[0]).to.eq('abc@def.com');
    });

    it('should not update the profile if form errors', function() {
      var form = {
        $valid: false
      };
      controller.submit(form);
      $rootScope.$apply();
      expect(currentState).to.not.be.defined;
    });

    it('should update the profile', function() {
      var form = {
        $valid: true
      };
      controller.submit(form);
      $rootScope.$apply();
      expect(currentState).to.eq('root');
    });

  });

  describe('Template', () => {
    // template specs
    // tip: use regex to ensure correct bindings are used e.g., {{  }}
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
