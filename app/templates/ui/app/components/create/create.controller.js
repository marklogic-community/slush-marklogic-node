import X2JS from 'x2js';

class CreateCtrl {
  constructor($scope, mlRest, $state, userService, toast, $stateParams) {

    this.$scope = $scope;
    this.mlRest = mlRest;
    this.$state = $state;
    this.userService = userService;
    this.toast = toast;
    this.$stateParams = $stateParams;

    this.$scope.$watch(this.userService.currentUser, (newValue, oldValue) => {
      this.currentUser = newValue;
    });
  }

  $onInit() {

    this.x2js = new X2JS({
      enableToStringFunc: true
    });

    this.mode = 'create';

    if (this.doc) {
      this.mode = 'edit';
      //check extension
      if (this.doc.config.params.format === 'json') {
        this.person = this.doc.data;
      } else {
        /* jscs: disable */
        //expect xml format
        /*jshint camelcase: false */

        var wrapped = this.x2js.xml2js(this.doc.data);
        this.person = wrapped.xml;
      }

      if (!this.person.tags) {
        this.person.tags = [];
      }

      if (!this.person.friends) {
        this.person.friends = [];
      }

      if (!this.person.location) {
        this.person.location = {
          latitude: 0,
          longitude: 0
        };
      }

      this.uri = this.$stateParams.uri;

    } else {
      this.mode = 'create';

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
    }
  }

  submit() {
    var extension = '.json';
    var data = this.person;
    if (this.person.docFormat === 'xml') {
      extension = '.xml';
      var wrap = {
        xml: this.person
      };
      /*jshint camelcase: false */
      data = this.x2js.js2xml(wrap);
    }
    /* jscs: enable */
        if (this.mode === 'create') {
          this.mlRest.createDocument(data, {
            format: this.person.docFormat,
            directory: '/content/',
            extension: extension,
            collection: ['data', 'data/people']
              // TODO: add read/update permissions here like this:
              // 'perm:sample-role': 'read',
              // 'perm:sample-role': 'update'
          }).then(response => {
            this.toast.success('Created');
            this.$state.go('root.view', {
              uri: response.replace(/(.*\?uri=)/, '')
            });
          }, response => {
            this.toast.danger(response.data);
          });
        } else {
          // use update when in update mode
          this.mlRest.updateDocument(data, {
            uri: this.uri
          }).then(response => {
            this.toast.success('Saved');
            this.$state.go('root.view', {
              uri: this.uri
            });
          }, response => {
            this.toast.danger(response.data);
          });
        }
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

CreateCtrl.$inject = ['$scope', 'MLRest', '$state', 'userService', 'ngToast', '$stateParams'];

export
default CreateCtrl;

//updated
/*
(function() {
  'use strict';

  angular.module('app.create')
    .controller('CreateCtrl', CreateCtrl);

  CreateCtrl.$inject = ['$scope', 'MLRest', '$state', 'userService',
    'ngthis.toast', 'this.x2js', 'doc', '$stateParams'
  ];

  function CreateCtrl($scope, mlRest, $state, userService, this.toast, this.x2js, doc, $stateParams) {
    var ctrl = this;

    ctrl.this.x2js = this.x2js;

    ctrl.mode = 'create';

    if (doc) {
      ctrl.mode = 'edit';
      //check extension
      if (doc.config.params.format === 'json') {
        ctrl.person = doc.data;
      } else {
        /* jscs: disable */
//expect xml format
/*jshint camelcase: false */
/*
        var wrapped = this.x2js.xml_str2json(doc.data);
        ctrl.person = wrapped.xml;
      }

      if (!ctrl.person.tags) {
        ctrl.person.tags = [];
      }

      if (!ctrl.person.friends) {
        ctrl.person.friends = [];
      }

      if (!ctrl.person.location) {
        ctrl.person.location = {
          latitude: 0,
          longitude: 0
        };
      }

      ctrl.uri = $stateParams.uri;

    } else {
      ctrl.mode = 'create';

      ctrl.person = {
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
    }

    angular.extend(ctrl, {
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
      var extension = '.json';
      var data = ctrl.person;
      if (ctrl.person.docFormat === 'xml') {
        extension = '.xml';
        var wrap = {
          xml: ctrl.person
        };
        /*jshint camelcase: false */
/*
        data = this.x2js.json2xml_str(wrap);
      }
      /* jscs: enable */
/*

      if (ctrl.mode === 'create') {
        mlRest.createDocument(data, {
          format: ctrl.person.docFormat,
          directory: '/content/',
          extension: extension,
          collection: ['data', 'data/people']
            // TODO: add read/update permissions here like this:
            // 'perm:sample-role': 'read',
            // 'perm:sample-role': 'update'
        }).then(function(response) {
          this.toast.success('Created');
          $state.go('root.view', {
            uri: response.replace(/(.*\?uri=)/, '')
          });
        }, function(response) {
          this.toast.danger(response.data);
        });
      } else {
        // use update when in update mode
        mlRest.updateDocument(data, {
          uri: ctrl.uri
        }).then(function(response) {
          this.toast.success('Saved');
          $state.go('root.view', {
            uri: ctrl.uri
          });
        }, function(response) {
          this.toast.danger(response.data);
        });
      }
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
}());
*/

/*
//es5 style

import angular from 'angular';

function CreateCtrl($scope, mlRest, $state, userService, this.toast) {
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
      this.toast.success('Record created.');
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
