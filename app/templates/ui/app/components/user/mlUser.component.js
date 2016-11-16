import template from './user-component.html';

UserController.$inject = ['$scope', 'userService', 'loginService'];

function UserController($scope, userService, loginService) {
  var ctrl = this;
  angular.extend(ctrl, {
    username: null,
    password: null,
    loginService: loginService
  });
  $scope.$watch(userService.currentUser, function(newValue) {
    ctrl.currentUser = newValue;
  });
}

const component = {
  bindings: {
    showCancel: '=',
    mode: '@',
    callback: '&'
  },
  controller: UserController,
  template: template
};

export
default component;
