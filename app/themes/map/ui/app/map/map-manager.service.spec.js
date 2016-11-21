/* jshint -W117, -W030 */
(function () {
  'use strict';

  describe('Service: MLUiGmapManager', function () {

    var service;

    var results = [{
      uri: '/test1.json',
      extracted: {
        content: [{
          location: {
            latitude: 1,
            longitude: 1
          }
        }]
      }
    },{
      uri: '/test2.json',
      extracted: {
        content: [{
          location: {
            latitude: 2,
            longitude: 2
          }
        }]
      }
    },{
      uri: '/test3.json',
      extracted: {
        content: [{
          location: {
            latitude: 3,
            longitude: 3
          }
        }]
      }
    }];
    var facets = {
      geo1: {
        boxes: [{
          s: -1,
          w: -1,
          n: 1,
          e: 1,
          count: 10
        }]
      },
      geo2: {
        boxes: [{
          s: -2,
          w: -2,
          n: 2,
          e: 2,
          count: 20
        }]
      }
    };

    beforeEach(function() {
      bard.appModule('app.map');
    });

    beforeEach(inject(function (_MLUiGmapManager_) {
      service = _MLUiGmapManager_;
    }));

    it('should be defined', function () {
      expect(service).to.be.defined;
    });

    it('should init', function () {
      service.init(0, 0);
    });

    it('should set result markers', function () {
      service.markerMode = 'results';
      service.setResultMarkers(results);
      expect(service.getMarkers().length).to.eq(3);
    });

    it('should set facet markers', function () {
      service.markerMode = 'facets';
      service.setFacetMarkers(facets);
      expect(service.getMarkers().length).to.eq(2);
    });

    it('should watchBounds', function () {
      service.watchBounds();
    });

    it('should watchDrawings', function () {
      service.watchDrawings();
    });

    it('should resetMap', function () {
      service.resetMap();
    });

  });
}());
