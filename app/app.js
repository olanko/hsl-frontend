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
  $routeProvider.otherwise({redirectTo: function() {
      return '/?c=60.1838:24.9536:14';
    }
  });

  $locationProvider.html5Mode(true);
}]);
