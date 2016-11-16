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
    if (ctrl.callback && !loginService.loginError()) {
      ctrl.callback({
        user: user
      });
    }
  }
}

export
default LoginCtrl;
