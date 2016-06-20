(function () {
  'use strict';

  angular.module('app.user')
    .controller('ProfileCtrl', ProfileCtrl);

  ProfileCtrl.$inject = ['$scope', '$state', 'MLRest', 'userService', 'ngToast', '$rootScope'];

  function ProfileCtrl($scope, $state, mlRest, userService, toast, $rootScope) {
    var ctrl = this;
    angular.extend(ctrl, {
      user: checkUser(userService.currentUser()),
      newEmail: '',
      addEmail: addEmail,
      removeEmail: removeEmail,
      submit: submit
    });

    function addEmail() {
      if (ctrl.user) {
        if (!ctrl.newEmail || hasEmailInputError()) {
          return;
        }
        ctrl.user.profile = ctrl.user.profile || {};
        if (!ctrl.user.profile.emails) {
          ctrl.user.profile.emails = [];
        }
        ctrl.user.profile.emails.push(ctrl.newEmail.trim());
        ctrl.newEmail = '';
      }
    }

    function removeEmail(index) {
      if (ctrl.user.profile && ctrl.user.profile.emails) {
        ctrl.user.profile.emails.splice(index, 1);
      }
    }

    function hasEmailInputError() {
      try {
        return $scope.profileForm.newEmail.$error.email === true;
      }
      catch (e) {
        return false;
      }
    }

    function submit(form) {
      if (form.$valid && ctrl.user.profile) {
        addEmail();

        if (ctrl.user.profile.emails) {
          _.pull(ctrl.user.profile.emails, '');
        }

        mlRest.updateDocument({
          user: ctrl.user.profile
        }, {
          format: 'json',
          uri: '/api/users/' + ctrl.user.username + '.json'
        }).then(function(data) {
          $rootScope.$broadcast('loginService:profile-changed');
          toast.success('Submitted');
          $state.go('root.landing');
        }, function(response) {
          toast.danger(response.data);
        });
      }
    }

    $scope.$watch(userService.currentUser, function(newValue) {
      ctrl.user = checkUser(newValue);
    });

    function checkUser(newValue) {
      var user = angular.copy(newValue);
      if (user && user.profile && user.profile.emails) {
        if (!angular.isArray(user.profile.emails)) {
          user.profile.emails = [user.profile.emails];
        }
      }
      return user;
    }
  }
}());
