describe('MapCtrl', function() {
  'use strict';
  beforeEach(module('hslMapApp.map'));

  var scope, MapCtrl, $httpBackend;

  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_) {
    scope = $rootScope.$new();
    MapCtrl = $controller('MapCtrl', {
      $scope: scope
    });
    $httpBackend = _$httpBackend_;

    $httpBackend.when('GET', 'http://37.139.24.180/hsljson').respond(
      JSON.stringify(
        {"RHKL00075":{"lat":60.195765,"lng":24.90167,"message":"10","dl":0,"veh":"RHKL00075","VP":{"desi":"10","dir":"2","oper":"XXX","veh":"RHKL00075","tst":"2016-03-15T15:42:58.000Z","tsi":1458056578,"spd":6.64,"hdg":343,"lat":60.195765,"long":24.90167,"dl":0,"odo":1878,"oday":"2016-03-15","jrn":"XXX","line":"XXX","start":"1752","stop_index":1,"source":"hsl live"}}}
      )
    );
  }));

  it('get route code for 1, 4, 6 and 9', function() {
    expect(scope.routeCode('1', '1')).toEqual('1001  1');
    expect(scope.routeCode('4', '1')).toEqual('1004  1');
    expect(scope.routeCode('6', '2')).toEqual('1006  2');
    expect(scope.routeCode('9', '2')).toEqual('1009  2');
  });
  it('get route code for 10', function() {
    expect(scope.routeCode('10', '1')).toEqual('1010  1');
    expect(scope.routeCode('10', '2')).toEqual('1010  2');
  });
  it('get route code for 7A and 6T', function() {
    expect(scope.routeCode('7A', '1')).toEqual('1007  1');
    expect(scope.routeCode('6T', '2')).toEqual('1006  2');
  });

  it('scope.updateTrams()', function () {
    $httpBackend.expectGET('http://37.139.24.180/hsljson');
    scope.updateTrams();
    $httpBackend.flush();

    expect(scope.trams).toBeDefined();
    expect(scope.trams.length).toBe(1);
  });
});
