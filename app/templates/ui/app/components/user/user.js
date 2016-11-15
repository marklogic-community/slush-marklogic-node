import angular from 'angular';
import ngSanitize from 'angular-sanitize';

import UserService from './user.service';
import MlUserComponent from './mlUser.component';

import Login from '../login/login';

//run globally since not in an es6 module
import 'script!ml-common-ng/dist/ml-common-ng';
import 'script!ng-toast';

const user = angular.module('app.user', ['ml.common', 'ngToast', ngSanitize, Login])
  .factory('userService', UserService)
  .component('mlUser', MlUserComponent)
  .name;

export
default user;
