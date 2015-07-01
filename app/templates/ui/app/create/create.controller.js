(function () {
  'use strict';

  angular.module('sample.create')
    .controller('CreateCtrl', CreateCtrl);

  CreateCtrl.$inject = ['$scope', 'MLRest', '$state', 'userService'];

  function CreateCtrl($scope, mlRest, $state, userService) {
    var ctrl = this;

    angular.extend(ctrl, {
      person: {
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
        latitude: 0,
        longitude: 0,
        tags: [],
        friends: [],
        greeting: null,
        favoriteFruit: null
      },
      newTag: null,
      currentUser: null,
      editorOptions: {
        plugins : 'advlist autolink link image lists charmap print preview'
      },
      submit: submit,
      addTag: addTag
    });

    function submit() {
      mlRest.createDocument(ctrl.person, {
        format: 'json',
        directory: '/content/',
        extension: '.json'
        // TODO: add read/update permissions here like this:
        // 'perm:sample-role': 'read',
        // 'perm:sample-role': 'update'
      }).then(function(response) {
        $state.go('root.view', { uri: response.replace(/(.*\?uri=)/, '') });
      });
    }

    function addTag() {
      ctrl.person.tags.push(ctrl.newTag);
      ctrl.newTag = null;
    }

    $scope.$watch(userService.currentUser, function(newValue) {
      ctrl.currentUser = newValue;
    });
  }
}());
