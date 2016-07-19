import angular from 'angular';

import mlSimilar from './similar.component';

const module = angular.module('app.similar', [])
  .component('mlSimilar', mlSimilar)
  .name;

export
default module;
