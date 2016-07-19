/* jshint -W117, -W030 */
import Module from './create';

import Controller from './create.controller';
import Component from './create.component';
import Template from './create.html';

describe('Create', () => {
  let $rootScope, controller, scope;
  let $q, MLRest, $state, userService, toast;

  var nextState;

  beforeEach(window.module(Module));

  beforeEach(inject(
    (_$controller_, _$q_, _$rootScope_, _MLRest_, _$state_, _userService_, _ngToast_) => {
      $rootScope = _$rootScope_;
      scope = $rootScope.$new();
      $q = _$q_;
      MLRest = _MLRest_;
      $state = _$state_;
      userService = _userService_;
      toast = _ngToast_;

      sinon.stub(MLRest, 'createDocument', () => $q.when('/?uri=blah'));
      sinon.stub($state, 'go', function(state, params) {
        nextState = {
          state: state,
          params: params
        };
      });
    }));

  beforeEach(() => {
    // stub the current user
    scope = $rootScope.$new();
    controller = new Controller(scope, MLRest, $state, userService, toast);
  });

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
  });

  describe('Controller', () => {
    // controller specs
    it('should be created successfully', function() {
      expect(controller).to.be.defined;
    });

    it('has a person property [REMOVE]', () => { // erase if removing this.person from the controller
      expect(controller).to.have.property('person');
    });

    it('should add tags', function() {
      var tagValue = 'testTag';
      expect(controller.person.tags.length).to.eq(0);
      controller.newTag = tagValue;
      controller.addTag();
      expect(controller.person.tags.length).to.eq(1);
      expect(controller.person.tags[0]).to.eq(tagValue);
      expect(controller.newTag).to.eq.null;
    });

    it('should show the detail view when submitted', function() {
      controller.submit();
      $rootScope.$apply();
      expect(nextState).to.deep.eq({
        state: 'root.view',
        params: {
          uri: 'blah'
        }
      });
    });
  });

  describe('Template', () => {
    // template specs
    // tip: use regex to ensure correct bindings are used e.g., {{  }}
    it('has person in template [REMOVE]', () => {
      expect(Template).to.match(/\s?\$ctrl\.person\s?/g);
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
