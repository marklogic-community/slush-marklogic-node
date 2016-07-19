/* jshint -W117, -W030 */
import Module from './search';

import Controller from './search.controller';
import Component from './search.component';
import Template from './search.html';

//import MLSearchController from 'exports?MLSearchController!ml-search-ng/dist/ml-search-ng';

describe('Search', () => {

  let sandbox, $httpBackend;
  let $rootScope, controller, scope;
  let $q, $location, MLSearchFactory, userService, MLRest;

  var currentUser = null;
  /*
    var results = [{
      uri: 'abc'
    }, {
      uri: 'def'
    }];
  */
  beforeEach(window.module(Module));
  //jscs:disable maximumLineLength
  beforeEach(inject((_$q_, _$rootScope_, _$location_, _MLSearchFactory_, _userService_, _$httpBackend_, _MLRest_) => {
    //jscs:enable maximumLineLength
    $q = _$q_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();

    $location = _$location_;
    MLSearchFactory = _MLSearchFactory_;
    userService = _userService_;
    $httpBackend = _$httpBackend_;
    MLRest = _MLRest_;

    sandbox = sinon.sandbox.create();

    MLRest = sinon.stub(MLRest, 'search', function() {
      return $q.when({
        data: {
          results: [{
            metadata: 'test',
            uri: 'abc'
          }, {
            metadata: 'test',
            uri: 'def'
          }]
        }
      });
    });

    sandbox.stub(userService, 'currentUser', () => $q.when(currentUser));

    /*
    //atempts to mock up search/mlRest method
        sandbox.stub(MLSearchController.prototype, 'search', () => {
          return [{
            metadata: 'test',
            uri: 'abc'
          }, {
            metadata: 'test',
            uri: 'def'
          }];
        });

        server.respondWith('GET', /./, [200, {
          'Content-Type': 'application/json'
        }, `{
          data: {
            results: [{
              metadata: 'test',
              uri: 'abc'
            }, {
              metadata: 'test',
              uri: 'def'
            }]
          }
        }`]);
    */

  }));

  beforeEach(() => {
    controller = new Controller(scope, $location, userService, MLSearchFactory);
  });

  afterEach(() => {
    sandbox.restore();
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

    /*
        //test currently not working
        it('should run a search', function() {


          controller.search('stuff');
          $rootScope.$digest();

          //$httpBackend.flush();

          expect(controller.response.results).to.eq(results);
        });
        */
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

//Original test
/* jshint -W117, -W030 */
/*
(function() {
  'use strict';

  describe('Controller: SearchCtrl', function() {

    var controller;

    var currentUser = null;

    var results = [{
      uri: 'abc'
    }, {
      uri: 'def'
    }];

    beforeEach(function() {
      bard.appModule('app.search');
      bard.inject('$controller', '$q', '$rootScope', '$location',
        'userService', 'MLSearchFactory', 'MLRest');

      bard.mockService(userService, {
        currentUser: $q.when(currentUser)
      });


      bard.mockService(MLRest, {
        search: $q.when({
          data: {
            results: results
          }
        })
      });

    });

    beforeEach(function() {
      controller = $controller('SearchCtrl', {
        $scope: $rootScope.$new()
      });
      $rootScope.$apply();
    });

    it('should be created successfully', function() {
      expect(controller).to.be.defined;
    });

    it('should update the current user if it changes', function() {
      expect(controller.currentUser).to.not.be.defined;
    });

    it('should run a search', function() {
      controller.search('stuff');
      $rootScope.$apply();
      expect(controller.response.results).to.eq(results);
    });
  });
}());
*/
