/* jshint -W117, -W030 */
(function () {
  'use strict';

  describe('Directive: content-box', function () {

    var elem;

    beforeEach(function() {
      bard.appModule('app.dashboard');
      bard.inject('$compile', '$rootScope');
    });

    beforeEach(function() {
      var $scope = $rootScope.$new();
      elem = angular.element(
        '<content-box box-bordered="true" box-title="Example Charts"></content-box>'
      );
      $compile(elem)($scope);
      $scope.$digest();

      // flush promises
      $rootScope.$apply();
    });

    it('should compile', function() {
      expect(elem.hasClass('box')).to.eq(true);
    });

  });
})();
