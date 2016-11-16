import angular from 'angular';
import Login from './login/login';
import MessageBoard from './message-board/message-board';
import User from './user/user';
import Search from './search/search';
import ErrorModule from './error/error';
import Detail from './detail/detail';
import Create from './create/create';
import Profile from './profile/profile';

let componentModule = angular.module('app.components', [
  Login,
  MessageBoard,
  User,
  Search,
  ErrorModule,
  Detail,
  Create,
  Profile
])

.name;

export
default componentModule;
