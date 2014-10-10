(function () {
  'use strict';

  angular.module('sample.user')
    .factory('User', ['$http', function($http) {
      var user = {};

      init();

      $http.get('/user/status', {}).then(updateUser);

      function init() {
        user.name = '';
        user.password = '';
        user.loginError = false;
        user.authenticated = false;
        user.hasProfile = false;
        user.fullname = '';
        user.emails = [];
        return user;
      }

      function updateUser(response) {
        var data = response.data;

        user.authenticated = data.authenticated;

        if ( user.authenticated ) {
          user.name = data.username;

          if ( data.profile ) {
            user.hasProfile = true;
            user.fullname = data.profile.fullname;

            if ( _.isArray(data.profile.emails) ) {
              user.emails = data.profile.emails;
            } else {
              // wrap single value in array, needed for repeater
              user.emails = [data.profile.emails];
            }
          }
        }
      }

      angular.extend(user, {
        login: function(username, password) {
          $http.get('/user/login', {
            params: {
              'username': username,
              'password': password
            }
          }).then(function(reponse) {
            updateUser(reponse);
            user.loginError = !user.authenticated;
          });
        },
        logout: function() {
          $http.get('/user/logout').then(init);
        }
      });

      return user;
    }]);
}());
