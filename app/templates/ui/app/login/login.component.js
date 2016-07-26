(function() {

  'use strict';

  angular.module('app.login')
    .component('login', {
      bindings: {
        showCancel: '=',
        mode: '@',
        callback: '&'
      },
      controller: 'LoginCtrl',
      templateUrl: 'app/login/login-component.html',
    });

}());
