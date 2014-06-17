(function () {
  'use strict';

  angular.module('sample.create')
    .controller('CreateCtrl', ['$scope', 'MLRest', 'Features', '$window', function ($scope, mlRest, features, win) {
      var model = {
        demo: {
          name: '',
          description: '',
          host: '',
          hostType: 'internal',
          browsers: [],
          features: [],
          languages: [],
          bugs: [],
          comments: []
        },
        featureChoices: features.list(),
        browserChoices: ['Firefox', 'Chrome', 'IE']
      };

      angular.extend($scope, {
        model: model,
        editorOptions: {
          height: '100px',
          toolbarGroups: [
            { name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
            { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] }
          ],
          //override default options
          toolbar: '',
          /* jshint camelcase: false */
          toolbar_full: ''
        },
        updateBrowsers: function(browser) {
          var index = $scope.model.demo.browsers.indexOf(browser);
          if (index > -1) {
            $scope.model.demo.browsers.splice(index, 1);
          } else {
            $scope.model.demo.browsers.push(browser);
          }
        },
        submit: function() {
          mlRest.createDocument($scope.model.demo, {
            format: 'json',
            directory: '/demos/',
            extension: '.json',
            'perm:demo-cat-role': 'read',
            'perm:demo-cat-registered-role': 'update'
          }).then(function(data, status, headers, config) {
            win.location.href = '/detail?uri=' + headers('location').replace(/(.*\?uri=)/, '');
          });
        }
      });
    }]);
}());
