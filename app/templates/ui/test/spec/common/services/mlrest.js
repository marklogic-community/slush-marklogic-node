/* global describe, beforeEach, module, it, expect, inject */

describe('MLRest', function () {
  'use strict';

  var mlRest = null;
  var $httpBackend, $q;

  beforeEach(module('sample.common'));

  beforeEach(inject(function ($injector) {
    $q = $injector.get('$q');
    $httpBackend = $injector.get('$httpBackend');

    mlRest = $injector.get('MLRest', $q, $httpBackend);
  }));

  it('retrieves a document', function() {
    $httpBackend
      .expectGET('/v1/documents?format=json&uri=%2Fdocs%2Ftest1.json')
      .respond('foo');

    mlRest.getDocument('/docs/test1.json').then(function(response){
      expect(response.data).toBe('foo');
    });
    $httpBackend.flush();
  });

  it('rewrites search results metadata correctly', function() {
    $httpBackend
      .expectGET(/\/v1\/search\?format=json&options=all&pageLength=10&start=1&structuredQuery=.*/)
      .respond({
        'snippet-format': 'snippet',
        'total': 13,
        'start': 1,
        'page-length': 1,
        'results':[
          {
            'index': 1,
            'uri': '/demos/17380453717445161293.json',
            'path': 'fn:doc(\"/demos/17380453717445161293.json\")',
            'score': 0,
            'confidence': 0,
            'fitness': 0,
            'href': '/v1/documents?uri=%2Fdemos%2F17380453717445161293.json',
            'mimetype': 'application/json',
            'format': 'json',
            'matches': [{'path':'fn:doc(\"/demos/17380453717445161293.json\")/jbasic:json','match-text':['Semantic News Search This use case aims to demonstrate a combination of MarkLogic\'s built-in full-text XQuery XML content search and SPARQL...']}],
            'metadata': [{'name':'Semantic News Search','metadata-type':'element'}]
          }
        ],
        'query': {'and-query':[]}
      });
    var searchContext = mlRest.createSearchContext({options: 'all'});
    var actual;
    searchContext.search().then(function(response) { actual = response; });
    $httpBackend.flush();
    expect(actual.results[0].metadata).toBeDefined();
    expect(Array.isArray(actual.results[0].metadata.name)).toBeTruthy();
    expect(actual.results[0].metadata.name[0]).toBe('Semantic News Search');
    expect(Array.isArray(actual.results[0].metadata['metadata-type'])).toBeTruthy();
    expect(actual.results[0].metadata['metadata-type'][0]).toEqual('element');
  });

  it('sets the page size correctly', function() {
    $httpBackend
      .expectGET(/\/v1\/search\?format=json&options=all&pageLength=5&start=6&structuredQuery=.*/)
      .respond({
        'total': 13,
        'start': 6,
        'page-length': 5,
        'results':[
          // not relevant to test
        ],
        'query': {'and-query':[]}
      });

    var searchContext = mlRest.createSearchContext({options: 'all', pageLength: 5});
    var actual;
    // Go to the second page, with 5 results per page
    searchContext.setPage(2).search().then(function(response) { actual = response; });
    $httpBackend.flush();
    expect(actual.start).toEqual(6);
    expect(actual['page-length']).toEqual(5);
  });

  it('sets the sort operator correctly', function() {
    // this test assumes that the sort operator is called "sort"; the service code
    // makes this assumption as well.
    var searchContext = mlRest.createSearchContext();
    var actual = JSON.stringify(searchContext.sortBy('blah').getStructuredQuery());
    expect(actual).toMatch({'operator-state':{'operator-name':'sort','state-name':'blah'}});
  });

  it('selects facets correctly', function() {
    var searchContext = mlRest.createSearchContext();
    // turn the structured query into a JSON string...
    var fullQuery = JSON.stringify(searchContext.selectFacet('foo', 'bar').getStructuredQuery());
    // ... grab the part I want and turn that back into JSON for easy access.
    var facetQuery = JSON.parse('{' + fullQuery.match(/"range-constraint-query":\s*{[^}]+}/)[0] + '}');
    expect(facetQuery['range-constraint-query']['constraint-name']).toEqual('foo');
    expect(Array.isArray(facetQuery['range-constraint-query'].value)).toBeTruthy();
    expect(facetQuery['range-constraint-query'].value.length).toEqual(1);
    expect(facetQuery['range-constraint-query'].value[0]).toEqual('bar');
  });

  it('clears a facet correctly', function() {
    var searchContext = mlRest.createSearchContext();
    // make one facet selection:
    searchContext.selectFacet('foo', 'bar');
    // make another
    searchContext.selectFacet('cartoon', 'bugs bunny');
    var fullQuery = JSON.stringify(searchContext.getStructuredQuery());
    var fooQuery = fullQuery.match(/"constraint-name":\s*"foo"/);
    expect(fooQuery).not.toBeNull();
    var cartoonQuery = fullQuery.match(/"constraint-name":\s*"cartoon"/);
    expect(cartoonQuery).not.toBeNull();

    // now clear one selection:
    searchContext.clearFacet('foo', 'bar');

    fullQuery = JSON.stringify(searchContext.getStructuredQuery());
    fooQuery = fullQuery.match(/"constraint-name":\s*"foo"/);
    expect(fooQuery).toBeNull();
    cartoonQuery = fullQuery.match(/"constraint-name":\s*"cartoon"/);
    expect(cartoonQuery).not.toBeNull();

    // and clear the other one:
    searchContext.clearFacet('cartoon', 'bugs bunny');

    fullQuery = JSON.stringify(searchContext.getStructuredQuery());
    fooQuery = fullQuery.match(/"constraint-name":\s*"foo"/);
    expect(fooQuery).toBeNull();
    cartoonQuery = fullQuery.match(/"constraint-name":\s*"cartoon"/);
    expect(cartoonQuery).toBeNull();

  });

  it('clears all facets correctly', function() {
    var fullQuery, fooQuery, cartoonQuery;
    var searchContext = mlRest.createSearchContext();
    // make one facet selection:
    searchContext.selectFacet('foo', 'bar');
    // make another
    searchContext.selectFacet('cartoon', 'bugs bunny');

    fullQuery = JSON.stringify(searchContext.getStructuredQuery());
    fooQuery = fullQuery.match(/"constraint-name":\s*"foo"/);
    expect(fooQuery).not.toBeNull();
    cartoonQuery = fullQuery.match(/"constraint-name":\s*"cartoon"/);
    expect(cartoonQuery).not.toBeNull();

    // clear both selections
    searchContext.clearAllFacets();

    fullQuery = JSON.stringify(searchContext.getStructuredQuery());
    fooQuery = fullQuery.match(/"constraint-name":\s*"foo"/);
    expect(fooQuery).toBeNull();
    cartoonQuery = fullQuery.match(/"constraint-name":\s*"cartoon"/);
    expect(cartoonQuery).toBeNull();

  });

});
