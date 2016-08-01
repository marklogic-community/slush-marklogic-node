(function() {
  'use strict';

  angular.module('app.login')
    .factory('loginService', LoginService);

  LoginService.$inject = ['$http', '$uibModal', '$q', '$rootScope', '$state',
    '$stateParams', 'messageBoardService', '$transitions', 'userService'
  ];

  function LoginService($http, $uibModal, $q, $rootScope, $state,
    $stateParams, messageBoardService, $transitions, userService) {

    var service = {};
    var _loginMode = 'full'; // 'modal', 'top-right', or 'full'
    var _loginError;
    var _toStateName;
    var _toStateParams;
    var _isAuthenticated;
    var _userPrefix = '';
    var _protectedRoutes = [];

    function loginMode(mode) {
      if (mode === undefined) {
        return _loginMode;
      }
      _loginMode = mode;
    }

    function failLogin(response) {
      if (response.status > 200) {
        _loginError = true;
      }
    }

    function loginError() {
      return _loginError;
    }

    function getAuthenticatedStatus() {
      if (_isAuthenticated !== undefined) {
        return _isAuthenticated;
      }

      return $http.get('/api/user/status', {}).then(function(response) {
        if (response.data.appUsersOnly) {
          _userPrefix = response.data.appName + '-';
        }
        if (response.data.authenticated === false) {
          _isAuthenticated = false;
        } else {
          loginSuccess(response);
        }
        return service.isAuthenticated();
      });
    }

    function loginSuccess(response) {
      _loginError = null;
      _isAuthenticated = true;
      userService.updateUser(response);
    }

    function login(username, password) {
      return $http.post('/api/user/login', {
        'username': _userPrefix + username,
        'password': password
      }).then(function(response) {
        loginSuccess(response);
        return response;
      }, failLogin);
    }

    function loginPrompt() {
      var d = $q.defer();
      if (_loginMode === 'modal') {
        $uibModal.open({
          controller: ['$uibModalInstance', function($uibModalInstance) {
            var ctrl = this;
            ctrl.showCancel = $state.current.name !== 'root.landing';
            ctrl.close = function(user) {
              if (user) {
                d.resolve(user);
              } else {
                d.reject();
                $state.go('root.landing');
              }
              return $uibModalInstance.close();
            };
          }],
          controllerAs: 'ctrl',
          templateUrl: '/app/login/login-modal.html',
          backdrop: 'static',
          keyboard: false
        });
      } else if (_loginMode === 'top-right') {
        messageBoardService.message({
          title: 'Please sign-in to see content.'
        });
        var deregisterMsgBoard = $rootScope.$on('loginService:login-success', function(e, user) {
          messageBoardService.message(null);
          d.resolve(user);
          deregisterMsgBoard();
        });
      } else {
        $state.go('root.login', {
          'state': _toStateName || $state.current.name,
          'params': JSON.stringify((_toStateParams || $stateParams))
        }).then(function() {
          d.reject();
        });
      }
      return d.promise;
    }

    function logout() {
      return $http.get('/api/user/logout').then(function(response) {
        userService.logOut();
        _loginError = null;
        _isAuthenticated = false;
        $state.reload();
        return response;
      });
    }

    function isAuthenticated() {
      return _isAuthenticated;
    }

    function protectedRoutes(routes) {
      if (routes === undefined) {
        return _protectedRoutes;
      }
      _protectedRoutes = routes;
    }

    function routeIsProtected(route) {
      return _protectedRoutes.indexOf(route) > -1;
    }

    $transitions.onStart({
      to: function(state) {
        return routeIsProtected(state.name);
      }
    }, function($transition$) {

      if ($transition$.$to().name !== 'root.login') {
        _toStateName = $transition$.$to().name;
        _toStateParams = $transition$.$to().params;
      }

      if (routeIsProtected($transition$.$to().name)) {
        var auth = service.getAuthenticatedStatus();
        if (angular.isFunction(auth.then)) {
          return auth.then(function() {
            if (!service.isAuthenticated()) {
              return $state.target('root.login', {
                'state': _toStateName || $state.current.name,
                'params': JSON.stringify((_toStateParams || $stateParams))
              });
            }
          });
        } else {
          if (!auth) {
            return $state.target('root.login', {
              'state': _toStateName || $state.current.name,
              'params': JSON.stringify((_toStateParams || $stateParams))
            });
          }
        }
      }
    });

    $rootScope.$on('loginService:profile-changed', function() {
      _isAuthenticated = undefined;
      service.getAuthenticatedStatus();
    });

    angular.extend(service, {
      login: login,
      logout: logout,
      loginPrompt: loginPrompt,
      loginSuccess: loginSuccess,
      loginError: loginError,
      loginMode: loginMode,
      isAuthenticated: isAuthenticated,
      getAuthenticatedStatus: getAuthenticatedStatus,
      protectedRoutes: protectedRoutes
    });

    return service;
  }
}());
