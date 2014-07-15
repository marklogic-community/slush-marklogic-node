/* global xit, it, describe, beforeEach, module, inject, expect */

describe('Controller: CreateCtrl', function () {
  'use strict';

  var CreateCtrl, scope, win;

  beforeEach(function() {
    win = { location: { href: '' } };

    module('sample.create');
    module(function($provide) {
      $provide.value('$window', win);
    });
  });

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CreateCtrl = $controller('CreateCtrl', {
      $scope: scope,
      'MLRest': {},
      '$window': {}
    });
  }));

  xit('should set window location when submitted', function() {
    scope.submit();
    scope.$apply();
    expect(win.location.href).toEqual('/detail?uri=blah');
  });
});
