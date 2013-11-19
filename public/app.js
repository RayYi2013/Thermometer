var app = angular.module('myApp', ['myApp.services']);


app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'main.html',
            controller: 'MainCtrl'
        })
        .when('/settings/threshold/:id', {
            name: 'threshold',
            templateUrl: 'threshold.html',
            controller: 'ThresholdCtrl'
        })
        .when('/settings', {
            templateUrl: 'settings.html',
            controller: 'SettingsCtrl'
        })
        .otherwise({ redirectTo: '/' });
});


app.controller('MainCtrl', ['$scope', '$route','Settings','TemperatureService','MainCtrlHelper',
  function($scope, $route,  Settings, TemperatureService,MainCtrlHelper) {
      $scope.direction = '';
      $scope.format = Settings.format;

      var getTemperature = function(){
        var promise = TemperatureService.getTemperature();
        promise.then(function(temperature) {
            if(angular.isDefined(temperature)) {
                var reachThreshold = MainCtrlHelper.checkThreshold($scope, Settings,temperature);
                $scope.currentTemperature = temperature;
                if(reachThreshold){
                    $('#warningModal').modal('show');
                }
                else{
                    if($route.current.templateUrl == 'main.html'){
                        setTimeout(getTemperature,Settings.frequence*1000);
                    }
                }
            }
        });
    };

      $('#warningModal').on('hidden.bs.modal', function () {
          getTemperature();
      })

      getTemperature();

  }]);

app.controller('SettingsCtrl', ['$scope', '$location', 'Settings',
    function($scope, $location, Settings) {
        $scope.settings = Settings;

        $scope.deleteThreshold = function(index){
            Settings.thresholds.splice(index,1);
        };

        $scope.addThreshold = function(){
            Settings.thresholds.push({name:'NewName', point:50, fluctuation:0.5, direction:{up:false,down:false}});
            var path='/settings/threshold/' + (Settings.thresholds.length -1);

            $location.path(path);
            $location.replace();
        };
    }]);


app.controller('ThresholdCtrl', ['$scope',  '$routeParams','Settings',
    function($scope,  $routeParams,  Settings) {
        $scope.threshold = Settings.thresholds[$routeParams.id];
    }]);


