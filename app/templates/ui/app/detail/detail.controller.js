(function () {
  'use strict';
  angular.module('app.detail')
  .controller('DetailCtrl', DetailCtrl);

  DetailCtrl.$inject = ['doc', '$stateParams'];
  function DetailCtrl(doc, $stateParams) {
    var ctrl = this;

    var uri = $stateParams.uri;

    var type = doc.headers('content-type');

    var model = {
      xml : '',
      json : ''
    };

    var x2js = new X2JS();
    /* jscs: disable */
    if (type.lastIndexOf('application/json', 0) === 0) {
      /*jshint camelcase: false */
      model.xml = vkbeautify.xml(x2js.json2xml_str(doc.data));
      model.json = doc.data;
    } else if (type.lastIndexOf('application/xml', 0) === 0) {
      model.xml = vkbeautify.xml(doc.data);
      /*jshint camelcase: false */
      model.json = x2js.xml_str2json(doc.data);
      /* jscs: enable */
    } else if (type.lastIndexOf('text/plain', 0) === 0) {
      model.xml = doc.data;
      model.json = {'Document' : doc.data};
    } else if (type.lastIndexOf('application', 0) === 0 ) {
      model.xml = 'Binary object';
      model.json = {'Document type' : 'Binary object'};
    } else {
      model.xml = 'Error occured determining document type.';
      model.json = {'Error' : 'Error occured determining document type.'};
    }

    angular.extend(ctrl, {
      doc : doc.data,
      uri : uri,
      xml : model.xml,
      json : model.json
    });
  }
}());
