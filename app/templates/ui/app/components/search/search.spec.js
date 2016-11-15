/* jshint -W117, -W030 */
import Module from './search';

import Controller from './search.controller';
import Component from './search.component';
import Template from './search.html';

describe('app.search', () => {

  let $rootScope, controller, $componentController, $compile;
  let $q, $location, MLSearchFactory, userService, MLRest;

  let results = [{
    uri: 'abc'
  }, {
    uri: 'def'
  }];

  beforeEach(window.module(Module));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    $compile = $injector.get('$compile');

    MLRest = $injector.get('MLRest');
    $location = $injector.get('$location');
    MLSearchFactory = $injector.get('MLSearchFactory');
    userService = $injector.get('userService');

    $q = $injector.get('$q');

    sinon.stub(MLRest, 'search').returns($q.resolve({
      data: {
        results: results
      }
    }));

    sinon.stub(userService, 'currentUser').returns({
      name: 'test'
    });

  }));

  beforeEach(() => {
    controller = $componentController('search', {
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

    it('should update the current user if it changes', function() {
      expect(controller.currentUser).to.not.be.defined;
    });

    //test currently not working
    it('should run a search', function() {

      controller.search('stuff');
      $rootScope.$apply();

      expect(controller.response.results).to.eq(results);
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
