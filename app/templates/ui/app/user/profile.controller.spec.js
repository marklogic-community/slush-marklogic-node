/* jshint -W117, -W030 */
(function () {
  'use strict';

  describe('Controller: ProfileCtrl', function () {

    var controller;

    var currentUser = {
      emails: []
    };

    var currentState;

    beforeEach(function() {
      bard.appModule('app.user');
      bard.inject('$controller', '$q', '$rootScope', 'MLRest', '$state', 'userService');

      bard.mockService(MLRest, {
        _default: $q.when([]),
        updateDocument: $q.when()
      });

      bard.mockService(userService, {
        currentUser: function() {
          return currentUser;
        }
      });

      bard.mockService($state, {
        go: function(s) {
          currentState = s;
        }
      });

    });

    beforeEach(function () {
      controller = $controller('ProfileCtrl', {
        $scope: $rootScope.$new()
      });
      $rootScope.$apply();
    });

    it('should be created successfully', function () {
      expect(controller).to.be.defined;
    });

    it('should add an email', function() {
      expect(controller.user.emails.length).to.eq(0);
      controller.addEmail();
      $rootScope.$apply();
      expect(controller.user.emails.length).to.eq(1);
    });

    it('should remove an email', function() {
      controller.user.emails = [
        'abc@def.com',
        'def@ghi.com'
      ];

      expect(controller.user.emails.length).to.eq(2);
      controller.removeEmail(1);
      $rootScope.$apply();
      expect(controller.user.emails.length).to.eq(1);
      expect(controller.user.emails[0]).to.eq('abc@def.com');
    });

    it('should update the profile', function() {
      controller.submit();
      $rootScope.$apply();
      expect(currentState).to.eq('root');
    });
  });
}());
