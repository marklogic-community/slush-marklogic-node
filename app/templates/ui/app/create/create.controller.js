(function() {
  'use strict';

  angular.module('app.create')
    .controller('CreateCtrl', CreateCtrl);

  CreateCtrl.$inject = ['$scope', 'MLRest', '$state',
    'ngToast', 'x2js', 'doc', '$stateParams'
  ];

  function CreateCtrl($scope, mlRest, $state, toast, x2js, doc, $stateParams) {
    var ctrl = this;

    ctrl.x2js = x2js;

    ctrl.mode = 'create';

    ctrl.prevState = $stateParams.prev || 'root.landing';
    if (doc && (ctrl.prevState === 'root.view')) {
      ctrl.prevState = ctrl.prevState + '({uri: $ctrl.uri})';
    } else if (['root.create', 'root.edit'].indexOf(ctrl.prevState) >= 0) {
      ctrl.prevState = 'root.landing';
    }

    if (doc) {
      ctrl.mode = 'edit';
      //check extension
      if (doc.config.params.format === 'json') {
        ctrl.person = doc.data;
      } else {
        /* jscs: disable */
        //expect xml format
        /*jshint camelcase: false */
        var wrapped = x2js.xml_str2json(doc.data);
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
        data = x2js.json2xml_str(wrap);
      }
      /* jscs: enable */

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
          toast.success('Created');
          $state.go('root.view', {
            uri: response.replace(/(.*\?uri=)/, '')
          });
        }, function(response) {
          //since we already toast and redirect to the login screen on 401s
          //only toast on other errors
          if (response.status !== 401) {
            toast.danger(response.data);
          }
        });
      } else {
        // use update when in update mode
        mlRest.updateDocument(data, {
          uri: ctrl.uri
        }).then(function(response) {
          toast.success('Saved');
          $state.go('root.view', {
            uri: ctrl.uri
          });
        }, function(response) {
          toast.danger(response.data);
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
  }
}());
