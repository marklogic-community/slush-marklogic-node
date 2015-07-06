/* jshint -W117, -W030 */
(function () {
  'use strict';

  describe('Controller: CreateCtrl', function () {

    var controller;
    var nextState;

    beforeEach(function() {
      bard.appModule('sample.create');
      bard.inject('$controller', '$q', '$rootScope', 'MLRest', '$state', 'userService');

      bard.mockService(MLRest, {
        createDocument: $q.when('/?uri=blah')
      });

      bard.mockService($state, {
        go: function(state, params) {
          nextState = {
            state: state,
            params: params
          };
        }
      });
    });

    beforeEach(function () {
      // stub the current user
      controller = $controller('CreateCtrl', { $scope: $rootScope.$new() });
      $rootScope.$apply();
    });

    it('should be created successfully', function () {
      expect(controller).to.be.defined;
    });

    it('should add tags', function() {
      expect(controller.person.tags.length).to.eq(0);
      controller.addTag();
      expect(controller.person.tags.length).to.eq(1);
    });

    it('should show the detail view when submitted', function() {
      controller.submit();
      $rootScope.$apply();
      expect(nextState).to.deep.eq({
        state: 'root.view',
        params: {
          uri: 'blah'
        }
      });
    });
  });
}());
