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

});
