/* jshint -W117, -W030 */
(function () {
  'use strict';

  describe('Service: navService', function () {

    var service;

    var testStates = [{
      name: 'test',
      navLabel: {
        test: 'Test',
        area: 'testarea'
      },
      url: '/test'
    },{
      name: 'test2',
      navLabel: {
        test: 'Test 2',
        area: 'testarea'
      },
      url: '/test2'
    },{
      name: 'test3',
      navLabel: {
        test: 'Test 3'
      },
      url: '/test3'
    },{
      name: 'test4',
      url: '/test4'
    }];

    beforeEach(function() {
      bard.appModule('app.navigation');
      bard.inject('$state', '$q', '$rootScope');
      bard.mockService($state, {
        current: { name: 'root.landing', params: {} },
        go: function(stateName, stateParams) {
          this.current = { name: stateName, params: stateParams };
          return $q.when();
        }
      });

    });

    beforeEach(inject(function (_navService_) {
      service = _navService_;
      service.registerStates(testStates);
    }));

    it('should be defined', function () {
      expect(service).to.be.defined;
    });

    it('should act on state change', function(done) {
      $rootScope.$broadcast('$stateChangeSuccess', testStates[1]);
      $rootScope.$apply(service);
      done();
      expect(service.isActive(testStates[1].name, testStates[1].navLabel.area)).to.eq(true);

      $rootScope.$broadcast('$stateChangeSuccess', testStates[4]);
      $rootScope.$apply(service);
      done();
      expect(service.isActive(testStates[4].name)).to.eq(true);
    });

    it('should get links', function () {
      expect(service.getLinks().length).to.eq(4);
    });

    it('should get links for an area', function () {
      expect(service.getLinks('testarea').length).to.eq(2);
    });

    it('should toggle the sidebar', function () {
      service.showSidebar = false;
      service.toggleSidebar();
      expect(service.showSidebar).to.eq(true);
    });

    it('should goto link', function (done) {
      service.gotoLink(service.getLinks()[1]);
      $rootScope.$apply(service);
      done();
      expect(service.isActive(testStates[1].name, testStates[1].navLabel.area)).to.eq(true);
    });

  });
}());
