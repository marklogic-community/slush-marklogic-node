import angular from 'angular';

//run dependencies that haven't been designed for npm/imports globally as if they were in a script tag and load if necessary
import 'script!ml-common-ng/dist/ml-common-ng';
import 'script!ml-search-ng/dist/ml-search-ng-tpls';
import 'script!ml-search-ng/dist/ml-search-ng';

import SearchComponent from './search.component';

import User from '../user/user';
import Snippet from './snippet';

const Search = angular
  .module('app.search', ['ml.search', User, Snippet])
  .component('search', SearchComponent)
  .name;

export
default Search;
