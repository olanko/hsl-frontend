angular.module('hslMapApp.map', ['ngRoute'])
.controller('MapCtrl', ['$http', '$scope', function($http, $scope) {
  'use strict';

  $scope.trams = {};

  $scope.updateTrams = function () {
	$http.get('http://localhost:5005')
	  .then(function(resp) {
	  	$scope.trams = resp.data;
	  })
	  .catch(function(err) {
	  	console.log(err);
	  });
  };

  $scope.updateTrams();

  //setInterval($scope.updateTrams, 5000);
}]);