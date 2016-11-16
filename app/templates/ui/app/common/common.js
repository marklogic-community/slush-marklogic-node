import angular from 'angular';
import Root from './root/root';

let commonModule = angular.module('app.common', [
  Root
])

.name;

export
default commonModule;
