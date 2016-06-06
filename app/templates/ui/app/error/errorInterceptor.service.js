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
        if (rejection.status === 500 || rejection.status === 400) {
          var messageBoardService = $injector.get('messageBoardService');
          var msg;
          if (rejection.data && rejection.data.errorResponse) {
            msg = {
              title: rejection.data.errorResponse.status,
              body: rejection.data.errorResponse.message
            };
          } else {
            msg = {
              title: (rejection.status === 400) ? 'Bad Request' : 'Internal Server Error'
            };
          }
          messageBoardService.message(msg);
          var toastMsg = '<strong>' + msg.title + '</strong><p>' + msg.body + '</p>';
          toast.danger(toastMsg);
        }
        return $q.reject(rejection);
      }
    };
    return errorInterceptor;
  }
}());
