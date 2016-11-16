import angular from 'angular';
import uiRouter from 'angular-ui-router';
import angularMessages from 'angular-messages';
import bootstrapConfirm from 'angular-bootstrap-confirm';

import CreateComponent from './create.component';
import StringToNumber from './stringtonumber.directive';

import User from '../user/user';

//run globally since not in an es6 module
import 'script!ml-common-ng/dist/ml-common-ng';
import 'script!ng-toast';

const module = angular.module('app.create', [
    'ml.common',
    User,
    'ngToast',
    uiRouter,
    angularMessages,
    bootstrapConfirm
  ])
  .component('create', CreateComponent)
  .directive('stringToNumber', StringToNumber)
  .name;

export
default module;
