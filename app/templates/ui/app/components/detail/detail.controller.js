import X2JS from 'x2js';
import vkbeautify from 'vkbeautify';
/*
function DetailCtrl($stateParams) {
  var this = this;

  var uri = $stateParams.uri;
  var this.doc = this.this.doc;

  var contentType = this.doc.headers('content-type');

  var x2js = new X2JS();
  */
/* jscs: disable */
//if (contentType.lastIndexOf('application/json', 0) === 0) {
/*jshint camelcase: false */
/*
    this.xml = vkbeautify.xml(x2js.js2xml(this.doc.data));
    this.json = this.doc.data;
    this.type = 'json';
  } else if (contentType.lastIndexOf('application/xml', 0) === 0) {
    this.xml = vkbeautify.xml(this.doc.data);
    /*jshint camelcase: false */
/*
this.json = x2js.xml2js(this.doc.data);
this.type = 'xml';
/* jscs: enable */
/*
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

  angular.extend(this, {
    this.doc: this.doc.data,
    uri: uri
  });
}
*/


class DetailCtrl {
  constructor($stateParams) {
    this.$stateParams = $stateParams;
    this.uri = $stateParams.uri;
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
}

DetailCtrl.$inject = ['$stateParams'];

export
default DetailCtrl;
