/* jshint -W117, -W030 */
import Module from './create';

import Controller from './create.controller';
import Component from './create.component';
import Template from './create.html';

describe('app.create', () => {
  let $rootScope, $state, $location, $componentController, $compile;
  let MLRest, userService, ngToast;
  let $q;

  let nextState;

  beforeEach(window.module(Module));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    $state = $injector.get('$state');
    $location = $injector.get('$location');

    MLRest = $injector.get('MLRest');
    userService = $injector.get('userService');
    ngToast = $injector.get('ngToast');

    $q = $injector.get('$q');

    $compile = $injector.get('$compile');

    sinon.stub(MLRest, 'createDocument', () => $q.when('/?uri=blah'));

    sinon.stub($state, 'go', function(state, params) {
      nextState = {
        state: state,
        params: params
      };
    });

    sinon.stub(userService, 'currentUser').returns({
      name: 'test'
    });

  }));

  describe('Controller', () => {

    // controller specs
    let controller;

    beforeEach(() => {
      controller = $componentController('create', {
        $scope: $rootScope.$new()
      });

      //initialise controller
      controller.$onInit();
    });

    // controller specs
    it('should be created successfully', function() {
      expect(controller).to.be.defined;
    });

    it('has a person property', () => {
      expect(controller).to.have.property('person');
    });

    it('current user is empty', function() {
      expect(controller.currentUser).to.be.undefined;
    });

    it('should update the current user if user service returns one from digest', function() {
      $rootScope.$digest();
      expect(controller.currentUser).to.have.property('name');
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

  describe('View', () => {
    // view layer specs.
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      template = $compile('<create></create>')(scope);
      scope.$apply();
    });

    it('Load\'s title in template as a result of user being logged in', () => {
      expect(template.find('h2').html()).to.eq('Create a Document');
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
