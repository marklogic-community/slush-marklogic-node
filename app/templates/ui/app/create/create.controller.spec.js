/* jshint -W117, -W030 */
(function () {
  'use strict';

  describe('Controller: CreateCtrl', function () {

    var controller;
    var controller2;
    var nextState;

    beforeEach(function() {
      bard.appModule('app.create');
      bard.inject('$controller', '$q', '$rootScope', 'MLRest', '$state', 'userService',
        'x2js');

      bard.mockService(MLRest, {
        createDocument: $q.when('/?uri=blah'),
        updateDocument: $q.when('/?uri=blah')
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
      // create mock data
      var doc = {
        uri: 'blah',
        config: {
          params: ''
        },
        data: '<xml><x>test</x></xml>'
      };

      // for edit
      controller = $controller('CreateCtrl', { $scope: $rootScope.$new(), 'doc': doc,
        $stateParams: { uri: 'blah'} });

      // for create
      controller2 = $controller('CreateCtrl', { $scope: $rootScope.$new(), 'doc': null,
        $stateParams: { uri: null } });

      $rootScope.$apply();
    });

    it('should be created successfully', function () {
      expect(controller).to.be.defined;
    });

    it('should add tags - edit', function() {
      var tagValue = 'testTag';
      expect(controller.person.tags.length).to.eq(0);
      controller.newTag = tagValue;
      controller.addTag();
      expect(controller.person.tags.length).to.eq(1);
      expect(controller.person.tags[0]).to.eq(tagValue);
      expect(controller.newTag).to.eq.null;
    });

    it('should add tags - create', function() {
      var tagValue = 'testTag';
      expect(controller2.person.tags.length).to.eq(0);
      controller2.newTag = tagValue;
      controller2.addTag();
      expect(controller2.person.tags.length).to.eq(1);
      expect(controller2.person.tags[0]).to.eq(tagValue);
      expect(controller2.newTag).to.eq.null;
    });

    it('should show the detail view when submitted - edit', function() {
      controller.submit();
      $rootScope.$apply();
      expect(nextState).to.deep.eq({
        state: 'root.view',
        params: {
          uri: 'blah'
        }
      });
    });

    it('should show the detail view when submitted - create', function() {
      controller2.submit();
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
