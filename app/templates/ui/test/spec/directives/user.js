describe('User Directive', function () {
  'use strict';

  var $compile,
    $rootScope,
    tpl = '<div ml-user username="model.user.name" password="model.user.password" login="login()" logout="logout()"/>';

  beforeEach(inject(
    function (_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    }));
  describe(' Basic compilation',
    function () {
      it(' should scope username correctly',
        function () {
          var $parentScope = $rootScope.$new();
          $parentScope.model = {
            user: {
              name: 'test-name',
              password: 'test-pw'
            }
          };
          var $el = $compile(tpl)($parentScope);
          var $scope = $el.scope();
          expect($scope.model.user.name).toBe($parentScope.model.user.name);
        });

    });
});
