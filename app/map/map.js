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

  $scope.updateTrams = function () {
	$http.get('http://localhost:5005')
	  .then(function(resp) {
	  	$scope.trams = resp.data;

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

  //setInterval($scope.updateTrams, 5000);
}]);