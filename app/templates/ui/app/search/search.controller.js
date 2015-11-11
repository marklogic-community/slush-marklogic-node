/* global MLSearchController */
(function () {
  'use strict';

  angular.module('app.search')
    .controller('SearchCtrl', SearchCtrl);

  SearchCtrl.$inject = ['$scope', '$location', 'userService', 'MLSearchFactory'];

  // inherit from MLSearchController
  var superCtrl = MLSearchController.prototype;
  SearchCtrl.prototype = Object.create(superCtrl);

  function SearchCtrl($scope, $location, userService, searchFactory) {
    var ctrl = this;
    var mlSearch = searchFactory.newContext();

    superCtrl.constructor.call(ctrl, $scope, $location, mlSearch);

    ctrl.init();

    ctrl.setSnippet = function(type) {
      mlSearch.setSnippet(type);
      ctrl.search();
    };

    $scope.$watch(userService.currentUser, function(newValue) {
      ctrl.currentUser = newValue;
    });

    /* BEGIN Date/DateTime constraint logic */
    ctrl.dateFilters = {};
    ctrl.dateStartOpened = {};
    ctrl.dateEndOpened = {};
    ctrl.pickerDateStart = {};
    ctrl.pickerDateEnd = {};
    ctrl.dateTimeConstraints = {};

    mlSearch.getStoredOptions().then(function(data) {
      angular.forEach(data.options.constraint, function(constraint) {
        if (constraint.range && (constraint.range.type === 'xs:date' || constraint.range.type === 'xs:dateTime')) {
          ctrl.dateTimeConstraints[constraint.name] = {
            name: constraint.name,
            type: constraint.range.type
          };
        }
      });
    });

    ctrl.search = function(qtext) {
      ctrl.mlSearch.clearAdditionalQueries();
      for (var key in ctrl.dateFilters) {
        if (ctrl.dateFilters[key] && ctrl.dateFilters[key].length) {
          mlSearch.addAdditionalQuery(
            qb.and(
              ctrl.dateFilters[key]
            )
          );
        }
      }
      superCtrl.search.apply(ctrl, qtext);
    };

    ctrl.openStartDatePicker = function(contraintName, $event) {
      $event.preventDefault();
      $event.stopPropagation();
      ctrl.dateStartOpened[contraintName] = true;
    };

    ctrl.openEndDatePicker = function(contraintName, $event) {
      $event.preventDefault();
      $event.stopPropagation();
      ctrl.dateEndOpened[contraintName] = true;
    };

    ctrl.applyDateFilter = function(contraintName) {
      ctrl.dateFilters[contraintName] = [];
      if (ctrl.pickerDateStart[contraintName] && ctrl.pickerDateStart[contraintName] !== '') {
        var startISO = ctrl.pickerDateStart[contraintName].toISOString();
        var startValue;
        if (ctrl.dateTimeConstraints[contraintName].type === 'xs:date') {
          startValue = startISO.substr(0, startISO.indexOf('T')) + '-06:00';
        } else {
          startValue = startISO;
        }
        ctrl.dateFilters[contraintName].push(qb.ext.rangeConstraint(contraintName, 'GE', startValue));
      }
      if (ctrl.pickerDateEnd[contraintName] && ctrl.pickerDateEnd[contraintName] !== '') {
        var endISO = ctrl.pickerDateEnd[contraintName].toISOString();
        var endValue;
        if (ctrl.dateTimeConstraints[contraintName].type === 'xs:date') {
          endValue = endISO.substr(0, endISO.indexOf('T')) + '-06:00';
        } else {
          endValue = endISO;
        }
        ctrl.dateFilters[contraintName].push(qb.ext.rangeConstraint(contraintName, 'LE', endValue));
      }
      ctrl.search();
    };

    ctrl.clearDateFilter = function(contraintName) {
      ctrl.dateFilters[contraintName].length = 0;
      ctrl.search();
    };

    ctrl.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };
    /* END Date/DateTime constraint logic */
  }
}());
