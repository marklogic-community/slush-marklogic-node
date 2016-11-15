/* jshint -W117, -W030 */
import Module from './detail';

import Controller from './detail.controller';
import Component from './detail.component';
import Template from './detail.html';

describe('app.detail', () => {
  let $rootScope, $compile, $componentController, $q;
  let $stateParams, MLRest;

  let doc = {
    headers: () => {
      return 'application/json';
    },
    data: {
      name: 'hi'
    }
  };

  beforeEach(window.module(Module));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    $compile = $injector.get('$compile');

    $stateParams = $injector.get('$stateParams');
    MLRest = $injector.get('MLRest');

    $q = $injector.get('$q');

    sinon.stub(MLRest, 'extension', () => {
      return $q.when({
        data: {
          similar: []
        }
      });
    });

  }));

  describe('Controller', () => {

    // controller specs
    let controller;

    beforeEach(() => {
      controller = $componentController('detail', {
        $scope: $rootScope.$new()
      });

      // stub a document and uri
      $stateParams.uri = '/test/';

      controller.doc = doc;

      //initialise controller
      controller.$onInit();
    });

    // controller specs
    it('should be created successfully', function() {
      expect(controller).to.be.defined;
    });

    it('should have the doc data we gave it', function() {
      expect(controller.json).to.eq(doc.data);
    });

    it('should have correct uri', function() {
      expect(controller.$stateParams.uri).to.eq('/test/');
    });
  });

  describe('View', () => {
    // view layer specs.
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();

      //add doc to scope so that when compiled it will be added as a binding
      scope.doc = doc;

      template = $compile('<detail doc="doc"></detail>')(scope);
      scope.$apply();
    });

    it('Should load JSON tab', () => {
      expect(template.find('uib-tab-heading').html()).to.eq('JSON');
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
