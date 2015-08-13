(function () {
  'use strict';

  angular.module('app.user')
    .controller('ProfileCtrl', ProfileCtrl);

  ProfileCtrl.$inject = ['$scope', '$state', 'MLRest', 'userService'];

  function ProfileCtrl($scope, $state, mlRest, userService) {
    var ctrl = this;
    angular.extend(ctrl, {
      user: null,
      newEmail: null,
      addEmail: addEmail,
      removeEmail: removeEmail,
      submit: submit
    });

    function addEmail() {
      if ($scope.profileForm &&
          $scope.profileForm.newEmail &&
          $scope.profileForm.newEmail.$error.email) {
        return;
      }
      if (!ctrl.user.emails) {
        ctrl.user.emails = [];
      }
      ctrl.user.emails.push(ctrl.newEmail);
      ctrl.newEmail = null;
    }

    function removeEmail(index) {
      ctrl.user.emails.splice(index, 1);
    }

    function submit() {
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

    $scope.$watch(userService.currentUser, function(newValue) {
      ctrl.user = newValue;
    });
  }
}());
