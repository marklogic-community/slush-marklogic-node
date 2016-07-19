import controller from './login.controller';

import template from './login-component.html';

const component = {
  bindings: {
    showCancel: '=',
    mode: '@',
    callback: '&'
  },
  controller: controller,
  template: template
};

export
default component;
