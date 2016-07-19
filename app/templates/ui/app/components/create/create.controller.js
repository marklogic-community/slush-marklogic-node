class CreateCtrl {
  constructor($scope, mlRest, $state, userService, toast) {
    this.person = {
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
    };

    this.newTag = null;
    this.currentUser = null;
    this.editorOptions = {
      plugins: 'advlist autolink link image lists charmap print preview'
    };

    this.$scope = $scope;
    this.mlRest = mlRest;
    this.$state = $state;
    this.userService = userService;
    this.toast = toast;

    this.$scope.$watch(this.userService.currentUser, (newValue, oldValue) => {
      this.currentUser = newValue;
    });
  }

  submit() {
    this.mlRest.createDocument(this.person, {
      format: 'json',
      directory: '/content/',
      extension: '.json',
      collection: ['data', 'data/people']
      // TODO: add read/update permissions here like this:
      // 'perm:sample-role': 'read',
      // 'perm:sample-role': 'update'
    }).then((response) => {
      this.toast.success('Record created.');
      this.$state.go('root.view', {
        uri: response.replace(/(.*\?uri=)/, '')
      });
    });
  }

  addTag() {
    if (this.newTag && this.newTag !== '' && this.person.tags.indexOf(this.newTag) < 0) {
      this.person.tags.push(this.newTag);
    }
    this.newTag = null;
  }

  removeTag(index) {
    this.person.tags.splice(index, 1);
  }
}

CreateCtrl.$inject = ['$scope', 'MLRest', '$state', 'userService', 'ngToast'];

/*
//es5 style

import angular from 'angular';

function CreateCtrl($scope, mlRest, $state, userService, toast) {
  var ctrl = this;

  ctrl.person = null;

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
      location: {
        latitude: 0,
        longitude: 0
      },
      tags: [],
      friends: [],
      greeting: null,
      favoriteFruit: null
    },
    newTag: null,
    currentUser: null,
    editorOptions: {
      plugins: 'advlist autolink link image lists charmap print preview'
    },
    submit: submit,
    addTag: addTag,
    removeTag: removeTag
  });

  function submit() {
    mlRest.createDocument(ctrl.person, {
      format: 'json',
      directory: '/content/',
      extension: '.json',
      collection: ['data', 'data/people']
      // TODO: add read/update permissions here like this:
      // 'perm:sample-role': 'read',
      // 'perm:sample-role': 'update'
    }).then(function(response) {
      toast.success('Record created.');
      $state.go('root.view', {
        uri: response.replace(/(.*\?uri=)/, '')
      });
    });
  }

  function addTag() {
    if (ctrl.newTag && ctrl.newTag !== '' && ctrl.person.tags.indexOf(ctrl.newTag) < 0) {
      ctrl.person.tags.push(ctrl.newTag);
    }
    ctrl.newTag = null;
  }

  function removeTag(index) {
    ctrl.person.tags.splice(index, 1);
  }

  $scope.$watch(userService.currentUser, function(newValue) {
    ctrl.currentUser = newValue;
  });
}
*/
export
default CreateCtrl;
