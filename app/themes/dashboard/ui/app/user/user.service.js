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

      _currentUser = {
        name: data.username,
      };

      if ( data.profile ) {
        _currentUser.hasProfile = true;
        _currentUser.fullname = data.profile.fullname;

        if ( _.isArray(data.profile.emails) ) {
          _currentUser.emails = data.profile.emails;
        }
        else if (data.profile.emails) {
          // wrap single value in array, needed for repeater
          _currentUser.emails = [data.profile.emails];
        }
      }

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
