(function () {
  'use strict';

  angular.module('app')
    .factory('socket', ['socketFactory', function (socketFactory) {
      var mySocket = socketFactory();
      mySocket.forward('server');
      return mySocket;
    }])
  ;

}());
