/* globals MLSearchController: false */

import searchResultsTemplate from './search-results.html';

class SearchCtrl extends MLSearchController {
  constructor($scope, $location, userService, searchFactory) {

    super($scope, $location, searchFactory.newContext());

    this.$scope = $scope;
    this.$location = $location;
    this.userService = userService;
    this.searchFactory = searchFactory;
    this.init();

    //retrieve and insert searchResults template
    this.searchResultsTemplate = searchResultsTemplate;

    this.$scope.$watch(this.userService.currentUser, (newValue, oldValue) => {
      this.currentUser = newValue;
    });
  }

  setSnippet(type) {
    this.mlSearch.setSnippet(type);
    this.search();
  }
}

SearchCtrl.$inject = ['$scope', '$location', 'userService', 'MLSearchFactory'];

export
default SearchCtrl;
