/* global describe, beforeEach, afterEach, module, inject */

describe('Controller: DetailCtrl', function () {
  'use strict';

  var $httpBackend, $rootScope, $scope, createController;

  beforeEach(function() {
    module('sample');
  });
  // Initialize the controller and a mock scope
  beforeEach(inject(function ($injector) {
    // Set up the mock http service responses
    $httpBackend = $injector.get('$httpBackend');
    // Get hold of a scope (i.e. the root scope)
    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
    // The $controller service is used to create instances of controllers
    var $controller = $injector.get('$controller');

    createController = function() {
      return $controller('DetailCtrl', {'$scope' : $scope });
    };
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

});
