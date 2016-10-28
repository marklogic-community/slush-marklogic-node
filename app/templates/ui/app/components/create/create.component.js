import template from './create.html';
import controller from './create.controller';

const component = {
  bindings: {
    doc: '<'
  },
  controller: controller,
  template: template
};

export
default component;
