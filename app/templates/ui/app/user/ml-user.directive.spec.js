/* jshint -W117, -W030 */
(function () {
  'use strict';

  describe('Directive: ml-user', function () {

    var elem, controller;

    beforeEach(function() {
      bard.appModule('app.user');
      bard.inject('$compile', '$rootScope', '$templateCache', '$controller');

      $templateCache.put( 'app/user/ml-user.html',
        '<div class="ml-user"></div>'
      );
    });

    beforeEach(function() {
      var $scope = $rootScope.$new();
      elem = angular.element('<ml-user></ml-user>');
      $compile(elem)($scope);
      $scope.$digest();

      var user = { name: 'Guest' };

      controller = $controller('UserCtrl', {
        $scope: $scope,
        userService: {
          currentUser: function() {
            return user;
          }
        },
        loginService: {}
      });

      // flush promises
      $rootScope.$apply();
    });

    it('should compile', function() {
      expect(elem.hasClass('ml-user')).to.eq(true);
    });

  });
})();
