'use strict';

describe('User', function () {
  var user = null;

  beforeEach(module('sample'));

  beforeEach(function () {
    var $injector = angular.injector([ 'sample' ]);
    user = $injector.get('User');
  });

  it('creates a user model by default', function() {
    var validPropNames = ['name', 'password', 'loginError', 'authenticated', 'hasProfile', 'fullname', 'emails', 'init'];
    var prop, i;
    //console.log(user);

    // check for valid props
    for (i in validPropNames) {
      prop = validPropNames[i];
      //console.log('user['+prop+']='+(user[prop]!==undefined));
      expect( user[prop] ).not.toBe( undefined );
    }

    // check for invalid props
    for (prop in user) {
      i = $.inArray(prop, validPropNames);
      //console.log(prop+'='+i);
      expect( i ).not.toBe( -1 );
    }
  });

});
