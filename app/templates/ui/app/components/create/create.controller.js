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
      enableToStringFunc: true,
      arrayAccessFormPaths: ['xml.tags', 'xml.friends']
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

        let wrapped = this.x2js.xml2js(this.doc.data);
        this.person = wrapped.xml;
      }

      if (!this.person.tags || (this.person.tags.length === 1 && this.person.tags[0] === '')) {
        this.person.tags = [];
      }

      if (!this.person.friends || (this.person.friends.length === 1 && this.person.friends[0] === '')) {
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
