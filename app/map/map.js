angular.module('hslMapApp.map', ['leaflet-directive'])
.config(function($logProvider){
  $logProvider.debugEnabled(false);
})
.controller('MapCtrl', ['$http', '$scope', '$location', function($http, $scope, $location) {
  'use strict';
  
  $scope.trams = {};
  $scope.filtertext = '';

  angular.extend($scope, {
    center: {
      lat: 60.1838,
      lng: 24.9536,
      zoom: 14
    },
    defaults: {
      zoomControl: false,
      zoomControlPosition: 'topright',
      scrollWheelZoom: true
    },
    markers: $scope.trams
  });

  $scope.updateTrams = function () {
	$http.get('http://37.139.24.180/hsljson')
	  .then(function(resp) {
	  	$scope.trams = _.filter(resp.data, function(o) {
        return o.message.match($scope.filtertext);
      });

    _.forEach($scope.trams, function(tram, key) {
      tram.routeCode = $scope.routeCode(tram.VP.desi, tram.VP.dir);
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

  $scope.routeCode = function (name, dir) {
    /* Parse route code to HSL format
      example: '1009 1'
        1 = Helsinki
        9 = tram number,
        last 1 = direction
    */

    name = name.replace(/\D/g, '');
    return '1' + ('000' + name).slice(-3) + ('   ' + dir).slice(-3);
  };

  $scope.routes = {};
  $scope.paths = {};

  angular.extend($scope, {
      paths: $scope.paths
  });

  $scope.showRoute = function (code) {
    console.log('showRoute: %s', code);
    if ($scope.routes[code]) {
      var r = $scope.routes[code];

      $scope.paths[code] = {
          type: 'polyline',
          color: 'red',
          latlngs: r.coordinates
      } ;

      console.log($scope.paths);
    }
  };

  $scope.hideRoute = function (code) {
    console.log('hideRoute: %s', code);
    if ($scope.paths[code]) {
      delete $scope.paths[code];
    }
  };

  $scope.getRoute = function (name, cb) {
    $http.get('http://localhost:6006/route/' + name)
    .then(function (resp) {
      _.forEach(resp.data, function (r) {
        $scope.routes[r.code] = r;

        r.coordinates = _.split(r.line_shape, '|').map(function (o) {
          var coord = _.split(o, ',');
          var lat = coord[1], lng = coord[0];
          return { lat: +lat, lng: +lng };
        });
      });
      $scope.showRoute(resp.data[0].code); //$scope.routeCode(name, '1'));
    });
  };

/*  $scope.getRoute('9');
  $scope.getRoute('63');
  $scope.getRoute('72');

  setTimeout(function () {
      $scope.hideRoute('1009  1');
  }, 10000); */
  setInterval($scope.updateTrams, 1000);
}]);
