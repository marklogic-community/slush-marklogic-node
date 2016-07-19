import angular from 'angular';
import Login from './login/login';
import MessageBoard from './message-board/message-board';
import User from './user/user';
import Search from './search/search';
import ErrorModule from './error/error';
import Detail from './detail/detail';
import Create from './create/create';

let componentModule = angular.module('app.components', [
  Login,
  MessageBoard,
  User,
  Search,
  ErrorModule,
  Detail,
  Create
])

.name;

export
default componentModule;
