(function() {
  'use strict';

  angular.module('app.error')
    .factory('errorInterceptor', ErrorInterceptor)
    .config(['$httpProvider', function($httpProvider) {
      $httpProvider.interceptors.push('errorInterceptor');
    }]);

  ErrorInterceptor.$inject = ['$q', '$injector', 'ngToast'];

  function ErrorInterceptor($q, $injector, toast) {
    var errorInterceptor = {
      responseError: function(rejection) {
        var msg;
        var toastMsg;
        if (rejection.status === 500 || rejection.status === 400) {
          var messageBoardService = $injector.get('messageBoardService');
          if (rejection.data && rejection.data.errorResponse) {
            msg = {
              title: rejection.data.errorResponse.status,
              body: rejection.data.errorResponse.message
            };
          } else {
            msg = {
              title: (rejection.status === 400) ? 'Bad Request' : 'Internal Server Error',
              body: ''
            };
          }
          messageBoardService.message(msg);
          toastMsg = '<strong>' + msg.title + '</strong><p>' + msg.body + '</p>';
          toast.danger(toastMsg);
        } else if (rejection.status === 401) {
          if (rejection.data && rejection.data.errorResponse) {
            msg = {
              title: rejection.data.errorResponse.status,
              body: rejection.data.errorResponse.message
            };
          } else {
            msg = {
              title: (rejection.status === 401) ? 'Unauthorised' : 'Internal Server Error',
              body: ''
            };
          }
          toastMsg = '<strong>' + msg.title + '</strong><p>' + msg.body + '</p>';
          var loginService = $injector.get('loginService');
          loginService.logout();
          toast.danger(toastMsg);
        }
        return $q.reject(rejection);
      }
    };
    return errorInterceptor;
  }
}());
