(function () {
  'use strict';

  angular.module('sample.user')
  .factory('User', ['MLRest', function(mlRest) {
    var user = {};

    function updateUser(data) {
      if (data.authenticated === true) {
        user.name = data.username;
        user.authenticated = true;
        if (data.profile !== undefined) {
          user.hasProfile = true;

          user.fullname = data.profile.fullname;

          if ($.isArray(data.profile.emails)) {
            user.emails = data.profile.emails;
          } else {
            // wrap single value in array, needed for repeater
            user.emails = [data.profile.emails];
          }
        }
      }
    }

    mlRest.checkLoginStatus().then(updateUser);

    user.init = function init() {
      user.name = '';
      user.password = '';
      user.loginError = false;
      user.authenticated = false;
      user.hasProfile = false;
      user.fullname = '';
      user.emails = [];
      return user;
    };

    return user;
  }]);
}());
