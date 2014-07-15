(function () {
  'use strict';

  angular.module('sample.create')
    .controller('CreateCtrl', ['$scope', 'MLRest', '$window', 'User', function ($scope, mlRest, win, user) {
      var model = {
        person: {
          isActive: true,
          balance: 0,
          picture: 'http://placehold.it/32x32',
          age: 0,
          eyeColor: '',
          name: '',
          gender: '',
          company: '',
          email: '',
          phone: '',
          address: '',
          about: '',
          registered: '',
          latitude: 0,
          longitude: 0,
          tags: [],
          friends: [],
          greeting: '',
          favoriteFruit: ''
        },
        newTag: '',
        user: user
      };

      angular.extend($scope, {
        model: model,
        editorOptions: {
          height: '100px',
          toolbarGroups: [
            { name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
            { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
            { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
            { name: 'links' }
          ],
          //override default options
          toolbar: '',
          /* jshint camelcase: false */
          toolbar_full: ''
        },
        submit: function() {
          mlRest.createDocument($scope.model.person, {
            format: 'json',
            directory: '/content/',
            extension: '.json'
            // TODO: add read/update permissions here like this:
            // 'perm:sample-role': 'read',
            // 'perm:sample-role': 'update'
          }).then(function(response) {
            win.location.href = '/detail?uri=' + response.headers('location').replace(/(.*\?uri=)/, '');
          });
        },
        addTag: function() {
          model.person.tags.push(model.newTag);
          model.newTag = '';
        }
      });
    }]);
}());
