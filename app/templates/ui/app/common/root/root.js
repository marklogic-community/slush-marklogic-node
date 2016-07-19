import angular from 'angular';

import RootComponent from './root.component';
import MessageBoard from '../../components/message-board/message-board';

const Root = angular
  .module('app.root', [MessageBoard])
  .component('root', RootComponent)
  .name;

export
default Root;
