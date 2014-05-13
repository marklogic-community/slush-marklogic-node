'use strict';

describe('Controller: DetailCtrl', function () {
  var $httpBackend, $rootScope, $scope, createController;

  var demoModel =
    {
      name: '',
      description: '',
      host: '',
      hostType: 'internal',
      browsers: [],
      features: [],
      languages: [],
      comments: [],
      bugs: []
    };

  beforeEach(function() {
    module('sample');
  });
  // Initialize the controller and a mock scope
  beforeEach(inject(function ($injector) {
    // Set up the mock http service responses
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('GET','/v1/documents?format=json').respond(200,demoModel,{'Content-Type':'application/json'});
    // Get hold of a scope (i.e. the root scope)
    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
    // The $controller service is used to create instances of controllers
    var $controller = $injector.get('$controller');

    createController = function() {
      return $controller('DemoCtrl', {'$scope' : $scope });
    };
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should add bug', function() {
    // backend definition for adding comment
    $httpBackend.when('POST', '/v1/resources/file-bug').respond(function(method,url,data) { return [200,data,{'Content-Type':'application/json'}]; });
    createController();
    $httpBackend.flush();
    $scope.addBug({'msg':'Status won\'t update', 'browser':'IE','status':'open'});
    $httpBackend.flush();
    expect($scope.model.demo.bugs.length).toBe(1);
    expect($scope.model.demo.bugs[0].msg).toBe('Status won\'t update');
    expect($scope.model.demo.bugs[0].status).toBe('open');
    //testing adding a second comment
    $scope.addBug({'msg':'Page won\'t load', 'browser':'Chrome', 'status':'closed'});
    $httpBackend.flush();
    expect($scope.model.demo.bugs.length).toBe(2);
    expect($scope.model.demo.bugs[1].msg).toBe('Page won\'t load');
    expect($scope.model.demo.bugs[1].status).toBe('closed');
  });


  it('should add comment', function() {
    // backend definition for adding comment
    $httpBackend.when('POST', '/v1/resources/comment').respond(function(method,url,data) { return [200,data,{'Content-Type':'application/json'}]; });
    createController();
    $httpBackend.flush();
    $scope.addComment({'msg':'This was a great demo'});
    $httpBackend.flush();
    expect($scope.model.demo.comments.length).toBe(1);
    expect($scope.model.demo.comments[0].msg).toBe('This was a great demo');
    //testing adding a second comment
    $scope.addComment({'msg':'This demo was even better than the first time'});
    $httpBackend.flush();
    expect($scope.model.demo.comments.length).toBe(2);
    expect($scope.model.demo.comments[1].msg).toBe('This demo was even better than the first time');
  });
});
