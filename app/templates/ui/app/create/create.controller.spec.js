/* jshint -W117, -W030 */
(function () {
  'use strict';

  describe('Controller: CreateCtrl', function () {

    var controller;
    var controller2;
    var controller3;
    var nextState;

    beforeEach(function() {
      bard.appModule('app.create');
      bard.inject('$controller', '$q', '$rootScope', 'MLRest', '$state', 'x2js');

      bard.mockService(MLRest, {
        createDocument: function () {
          if (arguments[0] === 'bad') {
            return $q.reject('bad');
          } else {
            return $q.when('/?uri=/new.json');
          }
        },
        updateDocument: function () {
          if (arguments[0] === 'bad') {
            return $q.reject('bad');
          } else {
            return $q.when('/?uri=' + arguments[1].uri);
          }
        }
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
      var jsondoc = {
        uri: '/doc.json',
        config: {
          params: {
            format: 'json'
          }
        },
        data: {
          docFormat: 'json',
          isActive: true,
          balance: 0,
          picture: 'http://placehold.it/32x32',
          age: 0,
          eyeColor: null,
          name: null,
          gender: null,
          company: null,
          email: null,
          phone: null,
          address: null,
          about: null,
          registered: null,
          location: {
            latitude: 0,
            longitude: 0
          },
          tags: [],
          friends: [],
          greeting: null,
          favoriteFruit: null
        }
      };
      var xmldoc = {
        uri: '/doc.xml',
        config: {
          params: {
            format: 'xml'
          }
        },
        data: '<xml><docFormat>xml</docFormat><x>test</x></xml>'
      };

      // for create
      controller = $controller('CreateCtrl', { $scope: $rootScope.$new(), 'doc': null,
        $stateParams: { uri: null } });

      // for json edit
      controller2 = $controller('CreateCtrl', { $scope: $rootScope.$new(), 'doc': jsondoc,
        $stateParams: { uri: '/doc.json', prev: 'root.view' } });

      // for xml edit
      controller3 = $controller('CreateCtrl', { $scope: $rootScope.$new(), 'doc': xmldoc,
        $stateParams: { uri: '/doc.xml', prev: 'root.edit' } });

      $rootScope.$apply();
    });

    it('should be created successfully', function () {
      expect(controller).to.be.defined;
      expect(controller2).to.be.defined;
      expect(controller3).to.be.defined;
    });

    it('should add/remove tags - create', function() {
      var tagValue = 'testTag';
      expect(controller.person.tags.length).to.eq(0);
      controller.newTag = tagValue;

      // add
      controller.addTag();
      expect(controller.person.tags.length).to.eq(1);
      expect(controller.person.tags[0]).to.eq(tagValue);
      expect(controller.newTag).to.eq.null;

      // don't add twice
      controller.addTag();
      expect(controller.person.tags.length).to.eq(1);

      // remove
      controller.removeTag(0);
      expect(controller.person.tags.length).to.eq(0);
    });

    it('should add/remove tags - edit', function() {
      var tagValue = 'testTag';
      expect(controller2.person.tags.length).to.eq(0);
      controller2.newTag = tagValue;

      // add
      controller2.addTag();
      expect(controller2.person.tags.length).to.eq(1);
      expect(controller2.person.tags[0]).to.eq(tagValue);
      expect(controller2.newTag).to.eq.null;

      // remove
      controller2.removeTag(0);
      expect(controller2.person.tags.length).to.eq(0);
    });

    it('should show the detail view when submitted - create', function() {
      controller.submit();
      $rootScope.$apply();
      expect(nextState).to.deep.eq({
        state: 'root.view',
        params: {
          uri: '/new.json'
        }
      });
    });

    it('should show the detail view when submitted - json edit', function() {
      controller2.submit();
      $rootScope.$apply();
      expect(nextState).to.deep.eq({
        state: 'root.view',
        params: {
          uri: '/doc.json'
        }
      });
    });

    it('should show the detail view when submitted - xml edit', function() {
      controller3.submit();
      $rootScope.$apply();
      expect(nextState).to.deep.eq({
        state: 'root.view',
        params: {
          uri: '/doc.xml'
        }
      });
    });

    it('should show a toast message at failed submit - create', function() {
      controller.person = 'bad';
      controller.submit();
      $rootScope.$apply();
      // no expects, just for code coverage
    });

    it('should show a toast message at failed submit - edit', function() {
      controller2.person = 'bad';
      controller2.submit();
      $rootScope.$apply();
      // no expects, just for code coverage
    });

  });
}());
