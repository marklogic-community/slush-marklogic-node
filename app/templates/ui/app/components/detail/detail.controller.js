import X2JS from 'x2js';
import vkbeautify from 'vkbeautify';

class DetailCtrl {
  constructor($stateParams, MLRest, toast, $state, $scope, userService) {
    this.$stateParams = $stateParams;
    this.MLRest = MLRest;
    this.uri = $stateParams.uri;
    this.toast = toast;
    this.$state = $state;
    this.$scope = $scope;
    this.userService = userService;

    this.$scope.$watch(this.userService.currentUser, (newValue, oldValue) => {
      this.currentUser = newValue;
    });
  }
  $onInit() {
    var contentType = this.doc.headers('content-type');

    var x2js = new X2JS();
    /* jscs: disable */
    if (contentType.lastIndexOf('application/json', 0) === 0) {
      /*jshint camelcase: false */
      this.xml = vkbeautify.xml(x2js.js2xml(this.doc.data));
      this.json = this.doc.data;
      this.type = 'json';
    } else if (contentType.lastIndexOf('application/xml', 0) === 0) {
      this.xml = vkbeautify.xml(this.doc.data);
      /*jshint camelcase: false */
      this.json = x2js.xml2js(this.doc.data);
      this.type = 'xml';
      /* jscs: enable */
    } else if (contentType.lastIndexOf('text/plain', 0) === 0) {
      this.xml = this.doc.data;
      this.json = {
        'this.document': this.doc.data
      };
      this.type = 'text';
    } else if (contentType.lastIndexOf('application', 0) === 0) {
      this.xml = 'Binary object';
      this.json = {
        'this.document type': 'Binary object'
      };
      this.type = 'binary';
    } else {
      this.xml = 'Error occured determining this.document type.';
      this.json = {
        'Error': 'Error occured determining this.document type.'
      };
    }
  }

  delete() {
    this.MLRest.deleteDocument(this.uri).then(response => {
      // create a toast with settings:
      this.toast.create({
        className: 'warning',
        content: 'Deleted ' + this.uri,
        dismissOnTimeout: true,
        timeout: 2000,
        onDismiss: () => {
          //redirect to search page
          this.$state.go('root.search');
        }
      });
    });
  }
}

DetailCtrl.$inject = ['$stateParams', 'MLRest', 'ngToast',
  '$state', '$scope', 'userService'
];

export
default DetailCtrl;
