(function() {
  'use strict';

  angular.module('app.user')
    .factory('userService', UserService);

  UserService.$inject = ['$rootScope'];

  function UserService($rootScope) {
    var _currentUser = null;

    function currentUser() {
      return _currentUser;
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

    function logOut() {
      _currentUser = null;
    }

    return {
      currentUser: currentUser,
      updateUser: updateUser,
      logOut: logOut
    };
  }
}());
