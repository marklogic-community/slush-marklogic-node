(function () {
  'use strict';

  angular.module('sample')
    .provider('Features', function() {

      var features = {
        list: [
          'Advanced Search',
          'Alerting',
          'ATOM',
          'Co-Occurence (2-way)',
          'Co-Occurence (n-way)',
          'Content Enrichment',
          'Content Editing',
          'Content suggestions',
          'Custom Publishing',
          'Document Annotations',
          'Document check-in/out',
          'Document Filtering',
          'Document Upload',
          'Dynamic output to PDF',
          'Dynamic output to PPT',
          'Document versioning',
          'ESRI ArcGIS integration',
          'Excel export',
          'Faceted Navigation',
          'Full text search',
          'Geospatial search',
          'Google Earth export',
          'Google Maps display',
          'Image metadata extraction',
          'KML export',
          'MarkLogic Content Pump',
          'OpenLayers display',
          'PDF Export',
          'Personalization',
          'Role-based Access Control',
          'RSS',
          'Saved Searches',
          'Semantics',
          'Tableau',
          'Tagging',
          'Tag Cloud',
          'Temporal search',
          'Visualization widgets',
          'Workflow queue'
        ],
        selFeature: '',
        optFeature: 'Select...'
      };

      this.$get = function() {
        var service = {
          list: function() {
            return features;
          }
        };

        return service;
      };
    });
}());
