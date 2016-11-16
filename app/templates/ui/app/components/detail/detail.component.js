import controller from './detail.controller';

import template from './detail.html';

const component = {
  bindings: {
    doc: '<'
  },
  controller: controller,
  template: template
};

export
default component;
