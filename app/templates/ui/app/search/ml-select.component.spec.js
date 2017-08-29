/* jshint -W117, -W030 */
(function () {
  'use strict';

  describe('Component: ml-select', function () {

    var elem, controller, snippet;

    beforeEach(function() {
      bard.appModule('app.search');
      bard.inject('$compile', '$rootScope', '$templateCache', '$componentController');

      $templateCache.put( 'app/search/ml-select.html',
        '<div class="ml-select"></div>'
      );
    });

    beforeEach(function() {
      var $scope = $rootScope.$new();
      $scope.setSnippet = function(selectionName) {
        snippet = selectionName;
      };
      elem = angular.element('<ml-select on-select="setSnippet(selectionName)"></ml-select>');
      $compile(elem)($scope);
      $scope.$digest();
      var bindings = {onSelect: $scope.setSnippet};
      controller = $componentController('mlSelect', { $scope: $scope }, bindings);

      // flush promises
      $rootScope.$apply();
    });

    it('should compile', function() {
      expect(elem.children().hasClass('ml-select')).to.eq(true);
    });

    it('should set snippet', function() {
      var type = 'xxx';
      controller.onSelect(type);
      expect(snippet).to.eq(type);
    });

  });
})();
