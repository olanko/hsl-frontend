angular.module('hslMapApp.map', ['leaflet-directive'])
.config(function($logProvider){
  $logProvider.debugEnabled(false);
})
.controller('MapCtrl', ['$http', '$scope', '$location', function($http, $scope, $location) {
  'use strict';


  angular.extend($scope, {
	center: {
	  lat: 60.1838,
	  lng: 24.9536,
	  zoom: 14
	},
    defaults: {
        scrollWheelZoom: false
    },
    markers: $scope.trams
  });

  $scope.trams = {};
  $scope.filtertext = '';

  $scope.updateTrams = function () {
	$http.get('http://37.139.24.180/hsljson')
	  .then(function(resp) {
	  	$scope.trams = _.filter(resp.data, function(o) {
        return o.message.match($scope.filtertext);
      });

    _.forEach($scope.trams, function(tram, key) {
      tram.icon = {
        type: 'awesomeMarker',
        icon: '-', //glyphicon-map-marker
        markerColor: 'blue',
        html: '<b>' + tram.message + '</b>'
      };

      if (tram.dl > 180) {
        tram.icon.markerColor = 'orange';
        tram.message = tram.message + '\n' + 'Myöhässä ' + tram.dl;
      }
      if (tram.dl > 600) {
        tram.icon.markerColor = 'red';
      }
      if (tram.dl < -60) {
        tram.icon.markerColor = 'green';
        tram.message = tram.message + '\n' + 'Etuajassa ' + tram.dl;
      }

    });

		angular.extend($scope, {
          markers: $scope.trams
        });

	  })
	  .catch(function(err) {
	  	console.log(err);
	  });
  };

  $scope.updateTrams();

  $scope.$on("centerUrlHash", function(event, centerHash) {
    $location.search({
    	c: centerHash
    });
  });

  //https://www.openstreetmap.org/#map=14/60.1837/24.9509

  setInterval($scope.updateTrams, 1000);
}]);
