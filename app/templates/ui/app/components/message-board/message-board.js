import angular from 'angular';

import MessageBoardService from './message-board.service';
import MessageBoardComponent from './message-board.component';

const messageBoard = angular
  .module('app.messageBoard', [])
  .factory('messageBoardService', MessageBoardService)
  .component('messageBoard', MessageBoardComponent)
  .name;

export
default messageBoard;
