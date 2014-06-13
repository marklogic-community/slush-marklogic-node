(function () {
  'use strict';

  angular.module('sample')
    .controller('ProfileCtrl', ['$scope', 'MLRest', 'User', '$location', function ($scope, mlRest, user, $location) {
      var model = {
        user: user // GJo: a bit blunt way to insert the User service, but seems to work
      };

      angular.extend($scope, {
        model: model,
        addEmail: function() {
          $scope.model.user.emails.push('');
        },
        removeEmail: function(index) {
          $scope.model.user.emails.splice(index, 1);
        },
        submit: function() {
          mlRest.updateDocument({
            user: {
              'fullname': $scope.model.user.fullname,
              'emails': $scope.model.user.emails
            }
          }, {
            format: 'json',
            uri: '/users/' + $scope.model.user.name + '.json',
            'perm:demo-cat-role': 'read',
            'perm:demo-cat-registered-role': 'update'
          }).then(function(data) {
            $location.path('/');
          });
        }
      });
    }]);
}());
