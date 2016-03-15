describe('MapCtrl', function() {
  beforeEach(module('hslMapApp.map'));

  var $controller;

  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
  }));

  describe('$scope.routeCode', function() {
    var $scope, controller;
    beforeEach(function() {
      $scope = {};
      controller = $controller('MapCtrl', { $scope: $scope });
    });
    it('get route code for 1, 4, 6 and 9', function() {
      expect($scope.routeCode('1', '1')).toEqual('1001  1');
      expect($scope.routeCode('4', '1')).toEqual('1004  1');
      expect($scope.routeCode('6', '2')).toEqual('1006  2');
      expect($scope.routeCode('9', '2')).toEqual('1009  2');
    });
    it('get route code for 10', function() {
      expect($scope.routeCode('10', '1')).toEqual('1010  1');
      expect($scope.routeCode('10', '2')).toEqual('1010  2');
    });
    it('get route code for 7A and 6T', function() {
      expect($scope.routeCode('7A', '1')).toEqual('1007  1');
      expect($scope.routeCode('6T', '2')).toEqual('1006  2');
    });
  });
});
