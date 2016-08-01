/* jshint -W117, -W030 */
(function() {
  'use strict';

  describe('Service: userService', function() {

    var service;
    var _user = {
      data: {
        username: 'bob',
        authenticated: true
      }
    };

    beforeEach(function() {
      bard.appModule('app.user');
      bard.inject('$q', '$http', '$rootScope', '$state');

      bard.mockService($http, {
        _default: $q.when([]),
        get: $q.when(_user),
        post: $q.when(_user)
      });

      bard.mockService($state, {
        current: {
          name: 'root.search',
          params: {}
        },
        go: function(stateName, stateParams) {
          this.current = {
            name: stateName,
            params: stateParams
          };
          return $q.when();
        },
        reload: function() {
          return $q.when();
        }
      });

    });

    beforeEach(inject(function(_userService_) {
      service = _userService_;
    }));

    it('should be defined', function() {
      expect(service).to.be.defined;
    });

    it('currentUser should not be defined', function() {
      expect(service.currentUser()).to.not.be.defined;
    });

    it('should update the current user when logged in', function() {
      service.updateUser(_user);
      expect(service.currentUser().username).to.eq('bob');
    });

    it('should not set user with invalid credentials', function() {
      _user.data.authenticated = false;
      service.updateUser(_user);

      expect(service.currentUser()).to.eq(null);
    });

    it('should clear user after logout', function() {
      _user.data.authenticated = true;
      service.updateUser(_user);

      service.logOut();

      expect(service.currentUser()).to.eq(null);
    });
  });
}());
