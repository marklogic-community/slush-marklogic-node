/* jshint -W117, -W030 */
(function () {
  'use strict';

  describe('Directive: ml-snippet', function () {

    var elem, controller, snippet;

    beforeEach(function() {
      bard.appModule('app.snippet');
      bard.inject('$compile', '$rootScope', '$templateCache', '$controller');

      $templateCache.put( 'app/search/ml-snippet.html',
        '<div class="ml-snippet"></div>'
      );
    });

    beforeEach(function() {
      var $scope = $rootScope.$new();
      $scope.setSnippet = function(type) {
        snippet = type.type; // note: test framework doesn't seem to unwrap arguments in directive callbacks
      };
      elem = angular.element('<ml-snippet set-snippet="setSnippet(type)"></ml-snippet>');
      $compile(elem)($scope);
      $scope.$digest();

      controller = $controller('SnippetCtrl', { $scope: $scope });

      // flush promises
      $rootScope.$apply();
    });

    it('should compile', function() {
      expect(elem.hasClass('ml-snippet')).to.eq(true);
    });

    it('should set snippet', function() {
      var type = 'xxx';
      controller.setSnippetType(type);
      expect(snippet).to.eq(type);
    });

  });
})();
