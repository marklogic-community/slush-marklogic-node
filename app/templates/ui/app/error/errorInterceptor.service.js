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
        if (rejection.data && rejection.data.errorResponse) {
          msg = {
            title: rejection.data.errorResponse.status,
            body: rejection.data.errorResponse.message
          };
        } else {
          msg = {
            title: (rejection.status === 401) ? 'Unauthorised' : (
              (rejection.status >= 400 && rejection.status < 500) ? 'Bad Request' :
                'Internal Server Error'
            ),
            body: ''
          };
        }
        toastMsg = '<strong>' + msg.title + '</strong><p>' + msg.body + '</p>';
        toast.create({
          className: 'danger',
          content: toastMsg,
          dismissOnTimeout: true,
          timeout: 2000,
          onDismiss: function () {
          }
        });
        if (rejection.status >= 400 && rejection.status !== 401) {
          var messageBoardService = $injector.get('messageBoardService');
          messageBoardService.message(msg);
        }
        return $q.reject(rejection);
      }
    };
    return errorInterceptor;
  }
}());
