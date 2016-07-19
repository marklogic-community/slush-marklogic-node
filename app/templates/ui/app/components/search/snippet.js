import angular from 'angular';

import mlSnippet from './snippet.component';

const Snippet =
  angular.module('app.snippet', [])
  .component('mlSnippet', mlSnippet)
  .name;

export
default Snippet;
