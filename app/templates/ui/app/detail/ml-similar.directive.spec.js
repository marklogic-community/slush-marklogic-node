/* jshint -W117, -W030 */
(function () {
  'use strict';

  describe('Directive: ml-similar', function () {

    var elem, elem2, elem3, elem4, elem5;

    beforeEach(function() {
      bard.appModule('app.similar');
      bard.inject('$compile', '$rootScope', '$templateCache', 'MLRest', '$q');

      bard.mockService(MLRest, {
        extension: function() {
          // single result
          if (arguments[1].params['rs:uri'] === '/some/uri4.json') {
            return $q.when({ data: { similar: '/some/other-uri4.json' }});

          // no result
          } else if (arguments[1].params['rs:uri'] === '/some/uri5.json') {
            return $q.when(null);

          // regular result
          } else {
            return $q.when({ data: { similar: [
              '/some/other-uri1.json',
              '/some/other-uri2.json',
              '/some/other-uri3.json'
            ]}});
          }
        }
      });

      $templateCache.put( 'app/detail/ml-similar.html',
        '<div class="ml-similar"><limit>{{_limit}}</limit><length>{{similar.length}}</length></div>'
      );
    });

    beforeEach(function() {
      var $scope = $rootScope.$new();
      $scope.uri = '/some/uri.json';
      $scope.limit = 2;
      elem = angular.element('<ml-similar uri="{{uri}}" limit="{{limit}}"></ml-similar>');
      $compile(elem)($scope);
      $scope.$digest();

      // bad limit
      var $scope2 = $rootScope.$new();
      $scope2.uri = '/some/uri2.json';
      $scope2.limit = 'x';
      elem2 = angular.element('<ml-similar uri="{{uri}}" limit="{{limit}}"></ml-similar>');
      $compile(elem2)($scope2);
      $scope2.$digest();

      // no limit
      var $scope3 = $rootScope.$new();
      $scope3.uri = '/some/uri3.json';
      elem3 = angular.element('<ml-similar uri="{{uri}}" limit="{{limit}}"></ml-similar>');
      $compile(elem3)($scope3);
      $scope3.$digest();

      // one result
      var $scope4 = $rootScope.$new();
      $scope4.uri = '/some/uri4.json';
      elem4 = angular.element('<ml-similar uri="{{uri}}" limit="{{limit}}"></ml-similar>');
      $compile(elem4)($scope4);
      $scope4.$digest();

      // no result
      var $scope5 = $rootScope.$new();
      $scope5.uri = '/some/uri5.json';
      elem5 = angular.element('<ml-similar uri="{{uri}}" limit="{{limit}}"></ml-similar>');
      $compile(elem5)($scope5);
      $scope5.$digest();

      // flush promises
      $rootScope.$apply();
    });

    it('should compile', function() {
      expect(elem.find('div').hasClass('ml-similar')).to.eq(true);
      expect(elem2.find('div').hasClass('ml-similar')).to.eq(true);
      expect(elem3.find('div').hasClass('ml-similar')).to.eq(true);
      expect(elem4.find('div').hasClass('ml-similar')).to.eq(true);
      expect(elem5.find('div').hasClass('ml-similar')).to.eq(true);
    });

    it('should have limit', function() {
      expect(elem.find('limit').text()).to.eq('2'); // passed in
      expect(elem2.find('limit').text()).to.eq('10'); // default
      expect(elem3.find('limit').text()).to.eq('10'); // default
      expect(elem3.find('limit').text()).to.eq('10'); // default
      expect(elem3.find('limit').text()).to.eq('10'); // default
    });

    it('should show similar uris', function() {
      expect(elem.find('length').text()).to.eq('2'); // truncated on limit
      expect(elem2.find('length').text()).to.eq('3'); // full list
      expect(elem3.find('length').text()).to.eq('3'); // full list
      expect(elem4.find('length').text()).to.eq('1'); // single result
      expect(elem5.find('length').text()).to.eq('0'); // single result
    });

  });
})();
