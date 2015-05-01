(function () {
  'use strict';

  angular.module('sample.searchMap', [])
    .controller('SearchMapCtrl', ['$scope', '$location', 'User', 'MLSearchFactory', '$routeParams', 'MLRemoteInputService',
      function ($scope, $location, user, searchFactory, $routeParams, remoteInput)
    {
      var mlSearch = searchFactory.newContext({
        queryOptions: 'map',
        pageLength: 100
      });

      var model = {
        authenticated: false,
        page: 1,
        qtext: '',
        search: {},
        user: user,
        detail: {},
        map: {
          center: {
            latitude: 0,
            longitude: 0
          },
          zoom: 2,
          bounds: {},
          events: {
            zoom_changed: function() {
              boundsChanged();
            },
            dragend: function() {
              boundsChanged();
            }
          }
        },
        markers: []
      };

      (function init() {
        // wire up remote input subscription
        remoteInput.initCtrl($scope, model, mlSearch, search);

        // run a search when the user logs in
        $scope.$watch('model.user.authenticated', function(oldValue, newValue) {
          search();
        });

        // capture initial URL params in mlSearch and ctrl model
        mlSearch.fromParams().then(function() {
          // if there was remote input, capture it instead of param
          mlSearch.setText(model.qtext);
          updateSearchResults({});
        });

        // capture URL params (forward/back, etc.)
        $scope.$on('$locationChangeSuccess', function(e, newUrl, oldUrl){
          mlSearch.locationChange( newUrl, oldUrl ).then(function() {
            if (newUrl !== oldUrl) {
              search();
            }
          });
        });
      })();

      function updateSearchResults(data) {
        model.search = data;
        model.qtext = mlSearch.getText();
        model.page = mlSearch.getPage();

        // Update the map
        updateMap(data);

        remoteInput.setInput( model.qtext );
        $location.search( mlSearch.getParams() );
      }

      function boundsChanged() {
        var bounds = {
          'south': model.map.bounds.southwest.latitude,
          'west': model.map.bounds.southwest.longitude,
          'north': model.map.bounds.northeast.latitude,
          'east': model.map.bounds.northeast.longitude
        };

        search(model.qtext, bounds);
      }

      function search(qtext, coordinates) {
        if ( !model.user.authenticated ) {
          model.search = {};
          return;
        }

        if ( arguments.length ) {
          model.qtext = qtext;
        }

        if (coordinates) {
          var geoQuery = {
            'geospatial-constraint-query' : {
              'constraint-name':'location',
              'box':[
                coordinates
              ]
            }
          };

          mlSearch.clearAdditionalQueries();
          mlSearch.addAdditionalQuery(geoQuery);
        }

        mlSearch
          .setText(model.qtext)
          .setPage(model.page)
          .search()
          .then(updateSearchResults);
      }

      function updateMap(data) {
        var i=0;
        var rec = { id: '', latitude: 0.0, longitude: 0.0 };

        var myMarkers = [];
        if (data && data.results) {
          for (i=0; i < data.results.length; i++) {
            rec.id = data.results[i].uri;
            rec.name = data.results[i].metadata.name.values[0];
            rec.latitude = data.results[i].metadata.latitude.values[0];
            rec.longitude = data.results[i].metadata.longitude.values[0];

            myMarkers.push(createMarker(rec));
          }
        }

        model.markers = myMarkers;
      }

      function createMarker(metadata) {
        var marker = null;
        if (metadata.latitude && metadata.longitude) {
          marker = {
            coords: {
              latitude: metadata.latitude,
              longitude: metadata.longitude
            },
            id: metadata.id,
            title: metadata.name,
            show: false
          };
          marker.onClick = function() {
            marker.show = !marker.show;
          };
        }

        return marker;
      }

      angular.extend($scope, {
        model: model,
        search: search,
        toggleFacet: function toggleFacet(facetName, value) {
          mlSearch
            .toggleFacet( facetName, value )
            .search()
            .then(updateSearchResults);
        }
      });

    }]);
}());
