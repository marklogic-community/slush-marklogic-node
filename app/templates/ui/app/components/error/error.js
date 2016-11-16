import angular from 'angular';

import messageBoard from '../message-board/message-board';
import ErrorInterceptor from './errorInterceptor.service';

const module = angular.module('app.error', [messageBoard])
  .factory('errorInterceptor', ErrorInterceptor)
  .config(['$httpProvider',
    function($httpProvider) {
      $httpProvider.interceptors.push('errorInterceptor');
    }
  ])
  .name;

export
default module;
