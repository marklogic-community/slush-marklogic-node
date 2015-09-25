(function () {
  'use strict';

  angular.module('app.user')
    .controller('ProfileCtrl', ProfileCtrl);

  ProfileCtrl.$inject = ['$scope', '$state', 'MLRest', 'userService'];

  function ProfileCtrl($scope, $state, mlRest, userService) {
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

        mlRest.updateDocument({
          user: {
            'fullname': ctrl.user.fullname,
            'emails': ctrl.user.emails
          }
        }, {
          format: 'json',
          uri: '/api/users/' + ctrl.user.name + '.json'
          // TODO: add read/update permissions here like this:
          // 'perm:sample-role': 'read',
          // 'perm:sample-role': 'update'
        }).then(function(data) {
          $state.go('root');
        });
      }
    }

    $scope.$watch(userService.currentUser, function(newValue) {
      ctrl.user = newValue;
    });
  }
}());
