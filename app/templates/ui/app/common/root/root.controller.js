RootCtrl.$inject = ['messageBoardService', 'userService', '$scope'];

function RootCtrl(messageBoardService, userService, $scope) {
  var ctrl = this;
  ctrl.currentYear = new Date().getUTCFullYear();
  ctrl.messageBoardService = messageBoardService;

  $scope.$watch(userService.currentUser, function(newValue) {
    ctrl.currentUser = newValue;
  });
}

export
default RootCtrl;
