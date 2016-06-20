(function () {
  'use strict';

  angular.module('app.user')
    .controller('ProfileCtrl', ProfileCtrl);

  ProfileCtrl.$inject = ['$scope', '$state', 'MLRest', 'userService', 'ngToast'];

  function ProfileCtrl($scope, $state, mlRest, userService, toast) {
    var ctrl = this;
    angular.extend(ctrl, {
      user: null,
      newEmail: '',
      addEmail: addEmail,
      removeEmail: removeEmail,
      submit: submit
    });

    function addEmail() {
      if (!ctrl.newEmail || hasEmailInputError()) {
        return;
      }
      if (!ctrl.user.emails) {
        ctrl.user.emails = [];
      }
      ctrl.user.emails.push(ctrl.newEmail.trim());
      ctrl.newEmail = '';
    }

    function removeEmail(index) {
      ctrl.user.emails.splice(index, 1);
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
      if (form.$valid) {
        addEmail();

        if (ctrl.user.emails) {
          _.pull(ctrl.user.emails, '');
        }

        ctrl.message = undefined;
        mlRest.callExtension('profile', {
          method: 'PUT',
          data: {
            user: {
              fullname: ctrl.user.fullname,
              emails: ctrl.user.emails
            }
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(function(data) {
          toast.success('Submitted');
          $state.go('root');
        });
      }
    }

    $scope.$watch(userService.currentUser, function(newValue) {
      ctrl.user = newValue;
    });
  }
}());
