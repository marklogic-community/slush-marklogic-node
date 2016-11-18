/* jshint -W117, -W030 */
(function () {
  'use strict';

  describe('Controller: RootCtrl', function () {

    var controller;

    beforeEach(function() {
      bard.appModule('app.root');
      bard.inject('$controller', '$rootScope');

      var msg = {};
      var user = { name: 'Guest' };

      controller = $controller('RootCtrl', {
        $scope: $rootScope.$new(),
        messageBoardService: {
          message: function() {
            return msg;
          }
        },
        userService: {
          currentUser: function() {
            return user;
          }
        }
      });

      $rootScope.$apply();
    });

    it('should be created successfully', function () {
      expect(controller).to.be.defined;
    });

  });
}());
