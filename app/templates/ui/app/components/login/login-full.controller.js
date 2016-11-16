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

export
default LoginFullCtrl;
