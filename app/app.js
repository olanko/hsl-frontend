angular.module('hslMapApp', [
  'ngRoute',
  'hslMapApp.map'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  'use strict';
  $routeProvider.when('/', {
    templateUrl: 'map/map.html',
    controller: 'MapCtrl'
  });
  $routeProvider.otherwise({redirectTo: '/'});

  $locationProvider.html5Mode(true);
}]);
