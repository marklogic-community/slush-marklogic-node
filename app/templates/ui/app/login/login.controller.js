(function () {
  'use strict';

  angular.module('app.login')
    .controller('LoginCtrl', LoginCtrl)
    .controller('LoginFullCtrl', LoginFullCtrl);

  LoginCtrl.$inject = ['$scope', 'loginService'];
  function LoginCtrl($scope, loginService) {
    var ctrl = this;
    angular.extend(ctrl, {
      username: null,
      password: null,
      login: login,
      loginService: loginService,
      logout: logout,
      cancel: cancel
    });

    function login() {
      loginService.login(ctrl.username, ctrl.password).then(function(user) {
        callback(user);
      });
    }

    function logout() {
      loginService.logout().then(function() {
        callback();
      });
    }

    function cancel() {
      callback();
    }

    function callback(user) {
      if ($scope.callback && !loginService.loginError()) {
        $scope.callback({user: user});
      }
    }
  }

  LoginFullCtrl.$inject = ['$state', '$stateParams'];
  function LoginFullCtrl($state, $stateParams) {
    var ctrl = this;
    angular.extend(ctrl, {
      showCancel: $stateParams.state !== 'root.landing',
      toState: toState
    });

    function toState(user) {
      if (user) {
        var params = null;
        if ($stateParams.params && /^\{.*\}$/.test($stateParams.params)) {
          params = JSON.parse($stateParams.params);
        }
        $state.go($stateParams.state || 'root.landing', params);
      } else {
        $state.go('root.landing');
      }
    }
  }

}());
