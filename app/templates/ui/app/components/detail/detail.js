import angular from 'angular';
import uiRouter from 'angular-ui-router';
import bootstrapConfirm from 'angular-bootstrap-confirm';

import SimilarModule from './similar';
import DetailComponent from './detail.component';

import 'script!ng-json-explorer/dist/angular-json-explorer.min.js';
import 'ng-json-explorer/dist/angular-json-explorer.css';

import User from '../user/user';

//run globally since not in an es6 module
import 'script!ml-common-ng/dist/ml-common-ng';
import 'script!ng-toast';

const module = angular.module('app.detail', [
    SimilarModule,
    uiRouter,
    'ngJsonExplorer',
    User,
    bootstrapConfirm // for delete confirmation popups
  ])
  .component('detail', DetailComponent)
  .name;

export
default module;
