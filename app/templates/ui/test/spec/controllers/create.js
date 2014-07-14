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
    var features = {
      list: function() {}
    };
    scope = $rootScope.$new();
    CreateCtrl = $controller('CreateCtrl', {
      $scope: scope,
      'MLRest': {},
      'Features': features,
      '$window': {}
    });
  }));

  it('should add a browser', function () {
    expect(scope.model.demo.browsers.length).toBe(0);
    scope.updateBrowsers('Netscape');
    expect(scope.model.demo.browsers.length).toBe(1);
  });

  it('should add multiple browsers', function () {
    scope.updateBrowsers('Netscape');
    expect(scope.model.demo.browsers.length).toBe(1);
    scope.updateBrowsers('Lynx');
    expect(scope.model.demo.browsers.length).toBe(2);
  });

  it('should remove browsers', function() {
    scope.model.demo.browsers = ['a', 'b', 'c'];
    scope.updateBrowsers('a');
    expect(scope.model.demo.browsers.length).toBe(2);
    expect(scope.model.demo.browsers[0]).toBe('b');
    expect(scope.model.demo.browsers[1]).toBe('c');
  });

  xit('should set window location when submitted', function() {
    scope.submit();
    scope.$apply();
    expect(win.location.href).toEqual('/detail?uri=blah');
  });
});
