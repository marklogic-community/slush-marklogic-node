/* global describe, beforeEach, module, it, expect, inject */

describe('MLRest', function () {
  'use strict';

  var qb = null;

  beforeEach(module('sample.common'));

  beforeEach(inject(function ($injector) {
    qb = $injector.get('MLQueryBuilder');
  }));

  it('builds a collection query with multiple collections', function() {
    var actual = qb.collectionConstraintQuery('testConstraint', ['collection1', 'collection2']);

    expect(actual['collection-constraint-query']).toBeDefined();
    expect(Array.isArray(actual['collection-constraint-query'].uri)).toBeTruthy();
    expect(actual['collection-constraint-query'].uri.length).toEqual(2);
    expect(actual['collection-constraint-query'].uri[0]).toEqual('collection1');
    expect(actual['collection-constraint-query'].uri[1]).toEqual('collection2');
    expect(actual['collection-constraint-query']['constraint-name']).toEqual('testConstraint');
  });


  it('builds a collection query with one collection', function() {
    var actual = qb.collectionConstraintQuery('testConstraint', 'testCollection');

    expect(actual['collection-constraint-query']).toBeDefined();
    expect(Array.isArray(actual['collection-constraint-query'].uri)).toBeTruthy();
    expect(actual['collection-constraint-query'].uri.length).toEqual(1);
    expect(actual['collection-constraint-query'].uri[0]).toEqual('testCollection');
    expect(actual['collection-constraint-query']['constraint-name']).toEqual('testConstraint');
  });

  it('builds a collection query with multiple collections', function() {
    var actual = qb.collectionConstraintQuery('testConstraint', ['collection1', 'collection2']);

    expect(actual['collection-constraint-query']).toBeDefined();
    expect(Array.isArray(actual['collection-constraint-query'].uri)).toBeTruthy();
    expect(actual['collection-constraint-query'].uri.length).toEqual(2);
    expect(actual['collection-constraint-query'].uri[0]).toEqual('collection1');
    expect(actual['collection-constraint-query'].uri[1]).toEqual('collection2');
    expect(actual['collection-constraint-query']['constraint-name']).toEqual('testConstraint');
  });

});
