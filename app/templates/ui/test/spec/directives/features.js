'use strict';

describe('Directive: features', function () {
  var scope, element;

  beforeEach(module('sample', 'app-templates'));

  beforeEach(inject( function($compile, $rootScope) {
    element = '<features edit-features="model.demo.features" feature-choices="model.featureChoices" edit-type="inline" mode="view"/>';
    element = $compile(element)($rootScope);
    $rootScope.$digest();
    scope = element.isolateScope();

    angular.extend(scope, {
      featureChoices: {
        list: ['blue', 'green'],
        optFeature: '',
        selFeature: ''
      },
      editFeatures: ['black']
    });

  }));

  it('should show list when mode="view"', function () {
    scope.mode = 'view';
    scope.$digest();

    expect( $( element ).find('ul') ).not.toHaveClass('ng-hide');
    expect( $( element ).find('div.features-edit') ).toHaveClass('ng-hide');
  });

  it('should show edit-form when mode="edit"', function () {
    scope.mode = 'edit';
    scope.$digest();

    expect( $( element ).find('ul') ).toHaveClass('ng-hide');
    expect( $( element ).find('.features-edit') ).not.toHaveClass('ng-hide');
  });

  it('should show cancel/save when mode="edit" and editType="inline"', function () {
    scope.mode = 'edit';
    scope.editType = 'inline';
    scope.$digest();

    expect( $( element ).find('.inline-controls') ).not.toHaveClass('ng-hide');
  });

  it('should add selected feature', function () {
    scope.mode = 'edit';
    scope.featureChoices.optFeature = 'blue';
    $( element ).find('.add-feature').trigger('click');
    scope.$digest();

    expect( scope.editFeatures.indexOf('blue') > -1 ).toBe(true);
  });

  it('should add new feature', function () {
    scope.mode = 'edit';
    scope.featureChoices.selFeature = 'pink';
    $( element ).find('.add-feature').trigger('click');
    scope.$digest();

    expect( scope.editFeatures.indexOf('pink') > -1 ).toBe(true);
  });

});
