'use strict';

describe('editable directive', function () {
  var scope, element;

  beforeEach(module('sample', 'app-templates'));

  beforeEach(inject( function($compile, $rootScope) {
    element = '<editable edit-model="model.demo.username" edit-type="text"/>';
    scope = $rootScope.$new();
    scope.model = {
      demo: {
        username: 'test1'
      }
    };
    element = $compile(element)(scope);
  }));

  it('should display original value when mode="view"', function () {
    scope.mode = 'view';
    scope.$digest();

    expect( $( element ).find('.editable') ).not.toHaveClass('ng-hide');
    expect( $( element ).find('.editable .value').text() ).toEqual('test1');
    expect( $( element ).find('.editor')).toHaveClass('ng-hide');
  });

  it('should show input when mode="edit" and editType="text"', function () {
    scope.mode = 'edit';
    scope.editType = 'text';
    scope.$digest();

    expect( $( element ).find('input') ).not.toHaveClass('ng-hide');
  });

  it('should show textarea when mode="edit" and editType="textarea"', function () {
    scope.mode = 'edit';
    scope.editType = 'textarea';
    scope.$digest();

    expect( $( element ).find('textarea') ).not.toHaveClass('ng-hide');
  });

});
