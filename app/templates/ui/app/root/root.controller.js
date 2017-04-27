(function () {
  'use strict';

  angular.module('app.root')
    .controller('RootCtrl', RootCtrl);

  RootCtrl.$inject = ['messageBoardService', 'userService', '$scope',
    '$state'
    , 'appConfig'
    , 'socket'
  ];

  function RootCtrl(messageBoardService, userService, $scope
    , $state
    , appConfig
    , socket
  ) {

    var rootCtrl = this;
    rootCtrl.currentYear = new Date().getUTCFullYear();
    rootCtrl.messageBoardService = messageBoardService;
    angular.extend(rootCtrl, appConfig);

    $scope.$watch(userService.currentUser, function(newValue) {
      rootCtrl.currentUser = newValue;
      // sample code to send message to server
      if (newValue) {
        socket.emit('client', newValue);
      }
    });

    $scope.$watch(function() {
      return $state.current.name;
    }, function(newValue) {
      rootCtrl.currentState = newValue;
    });


    $scope.$on('socket:server', function (event, data) {
      // event: just contains description of the event
      // data: contains the message
      console.log('event', event);
      console.log('data', data);
    });

  }
}());
