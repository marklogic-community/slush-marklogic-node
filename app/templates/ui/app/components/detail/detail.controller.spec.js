/* jshint -W117, -W030 */
import Module from './detail';

import Controller from './detail.controller';
import Component from './detail.component';
import Template from './detail.html';

describe('Detail', () => {
  let $rootScope, $stateParams, controller, scope;
  let doc;

  beforeEach(window.module(Module));

  beforeEach(inject((_$rootScope_, _$stateParams_) => {
    $rootScope = _$rootScope_;
    $stateParams = _$stateParams_;
    scope = $rootScope.$new();

  }));

  beforeEach(() => {
    // stub the current user
    $stateParams.uri = '/test/';

    controller = new Controller($stateParams);

    var headers = 'application/json';
    doc = {
      headers: headers,
      data: {
        name: 'hi'
      }
    };

    controller.doc = doc;
  });

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
  });

  describe('Controller', () => {
    // controller specs
    it('should be created successfully', function() {
      expect(controller).to.be.defined;
    });

    it('should have the doc data we gave it', function() {
      expect(controller.doc.headers).to.eq('application/json');
      expect(controller.doc.data).to.eq(doc.data);
    });

    it('should have correct uri', function() {
      expect(controller.$stateParams.uri).to.eq('/test/');
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
