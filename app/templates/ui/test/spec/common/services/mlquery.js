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

  // Collection Query tests
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

  // Document query
  it('builds a document query with one document', function() {
    var actual = qb.documentQuery('testuri');

    expect(actual['document-query']).toBeDefined();
    expect(Array.isArray(actual['document-query'].uri)).toBeTruthy();
    expect(actual['document-query'].uri.length).toEqual(1);
    expect(actual['document-query'].uri[0]).toEqual('testuri');
  });

  it('builds a document query with multiple documents', function() {
    var actual = qb.documentQuery(['uri1', 'uri2']);

    expect(actual['document-query']).toBeDefined();
    expect(Array.isArray(actual['document-query'].uri)).toBeTruthy();
    expect(actual['document-query'].uri.length).toEqual(2);
    expect(actual['document-query'].uri[0]).toEqual('uri1');
    expect(actual['document-query'].uri[1]).toEqual('uri2');
  });

  // or-query tests
  it('builds an or-query with one sub-query', function() {
    var actual = qb.orQuery(qb.textQuery('foo'));

    expect(actual['or-query']).toBeDefined();
    expect(Array.isArray(actual['or-query'].queries)).toBeTruthy();
    expect(actual['or-query'].queries.length).toEqual(1);
  });

  it('builds an or-query with multiple sub-queries', function() {
    var actual = qb.orQuery(qb.textQuery('foo'), qb.textQuery('bar'));

    expect(actual['or-query']).toBeDefined();
    expect(Array.isArray(actual['or-query'].queries)).toBeTruthy();
    expect(actual['or-query'].queries.length).toEqual(2);
  });
});
