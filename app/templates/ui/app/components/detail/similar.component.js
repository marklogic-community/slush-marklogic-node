import template from './similar-component.html';

const component = {
  bindings: {
    uri: '@',
    limit: '@'
  },
  controller: MlSimilar,
  template: template
};

export
default component;

MlSimilar.$inject = ['MLRest'];

function MlSimilar(mlRest) {
  var ctrl = this;

  mlRest.extension('extsimilar', {
    method: 'GET',
    params: {
      'rs:uri': ctrl.uri,
      'rs:limit': ctrl.limit ? ctrl.limit : 10
    }
  }).then(function(response) {
    ctrl.similar = response.data.similar;
  });
}
