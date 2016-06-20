/* jshint -W117, -W030 */
(function () {
  'use strict';

  describe('Controller: ProfileCtrl', function () {

    var controller;

    var currentUser = {
      profile: {
        emails: []
      }
    };

    var currentState;

    beforeEach(function() {
      bard.appModule('app.user');
      bard.inject('$controller', '$q', '$rootScope', 'MLRest', '$state', 'userService',
        'loginService');

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

      bard.mockService(loginService, {
        getAuthenticatedStatus: $q.when()
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

    it('should not add a blank email', function() {
      var newEmail = '';
      controller.newEmail = newEmail;
      expect(controller.user.profile.emails.length).to.eq(0);
      controller.addEmail();
      $rootScope.$apply();
      expect(controller.user.profile.emails.length).to.eq(0);
    });

    it('should add a nonblank email', function() {
      var newEmail = 'test@test.com';
      controller.newEmail = newEmail;
      expect(controller.user.profile.emails.length).to.eq(0);
      controller.addEmail();
      $rootScope.$apply();
      expect(controller.user.profile.emails.length).to.eq(1);
      expect(controller.user.profile.emails[0]).to.eq(newEmail);
    });

    it('should remove an email', function() {
      controller.user.profile.emails = [
        'abc@def.com',
        'def@ghi.com'
      ];

      expect(controller.user.profile.emails.length).to.eq(2);
      controller.removeEmail(1);
      $rootScope.$apply();
      expect(controller.user.profile.emails.length).to.eq(1);
      expect(controller.user.profile.emails[0]).to.eq('abc@def.com');
    });

    it('should not update the profile if form errors', function() {
      var form = {$valid:false};
      controller.submit(form);
      $rootScope.$apply();
      expect(currentState).to.not.be.defined;
    });

    it('should update the profile', function() {
      var form = {$valid:true};
      controller.submit(form);
      $rootScope.$apply();
      expect(currentState).to.eq('root.landing');
    });

  });
}());
