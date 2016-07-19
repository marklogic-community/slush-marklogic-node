import angular from 'angular';

import Common from './common/common';
import Components from './components/components';
import AppComponent from './app.component';

import routes from './route/routes';

import 'normalize.css';
import '../styles/main.less';

angular.module('app', [
    routes,
    Common,
    Components,
    'ml.search.tpls'
  ])
  .component('app', AppComponent);
