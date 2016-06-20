(function () {
  'use strict';

  angular.module('app.user')
    .factory('userService', UserService);

  UserService.$inject = ['$rootScope', 'loginService'];
  function UserService($rootScope, loginService) {
    var _currentUser = null;

    function currentUser() {
      return _currentUser;
    }

    function getUser() {
      if (_currentUser) {
        return _currentUser;
      }

      return loginService.getAuthenticatedStatus().then(currentUser);
    }

    function updateUser(response) {
      var data = response.data;

      if (data.authenticated === false) {
        return null;
      }

      // Copy all initially
      _currentUser = angular.copy(data);

      // Password property should not exist, delete anyhow just to be sure
      delete _currentUser.password;

      return _currentUser;
    }

    $rootScope.$on('loginService:login-success', function(e, user) {
      updateUser({ data: user });
    });

    $rootScope.$on('loginService:logout-success', function() {
      _currentUser = null;
    });

    return {
      currentUser: currentUser,
      getUser: getUser
    };
  }
}());
