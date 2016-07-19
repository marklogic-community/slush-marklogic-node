import angular from 'angular';
import uiRouter from 'angular-ui-router';

import SimilarModule from './similar';
import DetailComponent from './detail.component';

import 'script!ng-json-explorer/dist/angular-json-explorer.min.js';
import 'ng-json-explorer/dist/angular-json-explorer.css';

const module = angular.module('app.detail', [
    SimilarModule,
    uiRouter,
    'ngJsonExplorer'
  ])
  .component('detail', DetailComponent)
  .name;

export
default module;
