import angular from 'angular';
import ngSanitize from 'angular-sanitize';

import ProfileComponent from './profile.component';

import User from '../user/user';

//run globally since not in an es6 module
import 'script!ml-common-ng/dist/ml-common-ng';
import 'script!ng-toast';

const module = angular.module('app.profile', ['ml.common', 'ngToast', ngSanitize, User])
  .component('profile', ProfileComponent)
  .name;

export
default module;
