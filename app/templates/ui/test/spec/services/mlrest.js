/* global describe, beforeEach, module, it, expect */

describe('MLRest', function () {
  'use strict';
  var mlRest = null;
  var $httpBackend, $q;

  beforeEach(module('sample.common'));

  beforeEach(function () {
    var $injector = angular.injector([ 'sample.common', 'ngMock', 'ng' ]);
    $q = $injector.get('$q');
    $httpBackend = $injector.get('$httpBackend');

    mlRest = $injector.get('MLRest', $q, $httpBackend);
  });

  it('retrieves a document', function() {
    $httpBackend
      .expectGET('/v1/documents?format=json&uri=%2Fdocs%2Ftest1.json')
      .respond('foo');

    var actual = mlRest.getDocument('/docs/test1.json').then(function(response){
      expect(response.data).toBe('foo');
    });
    $httpBackend.flush();
  });

});
