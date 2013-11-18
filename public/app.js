var app = angular.module('myApp', ['myApp.services']);


app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'main.html',
            controller: 'MainCtrl'
        })
        .when('/settings', {
            templateUrl: 'settings.html',
            controller: 'SettingsCtrl'
        })
        .otherwise({ redirectTo: '/' });
});


app.controller('MainCtrl', ['$scope', '$route','Settings','TemperatureService',
  function($scope, $route,  Settings, TemperatureService) {
      $scope.directoin = '';
      $scope.format = Settings.format;
    function updateStatus(temperature){
        if(Settings.format == 'f'){
            //convert Celsius to Fahrenheit.
            var tc=parseInt(temperature);
            var tf=((9/5)*tc)+32;
            $scope.temperature = Math.round(tf*Math.pow(10,2))/Math.pow(10,2);
        }
        else{
            $scope.temperature = temperature;
        }

        var threshold = Settings.findThreshold(temperature);
        if(threshold){
            $scope.directoin = '';
            var changed = false;
            if(!$scope.threshold){
                changed = true;
            }
            else{
                changed = $scope.threshold.name != threshold.name
            }
            if(changed){
                if(threshold.direction.up && ($scope.threshold && $scope.threshold.point < temperature)){
                    $scope.directoin = 'up';
                }
                if(threshold.direction.down && ($scope.threshold && $scope.threshold.point > temperature)){
                    $scope.directoin = 'down';
                }
                $scope.threshold = threshold;
            }
        }

    }
      var getTemperature = function(){
        var promise = TemperatureService.getTemperature();
        promise.then(function(temperature) {
            if(angular.isDefined(temperature)) {
                updateStatus(temperature);
                currentTemperature = temperature;
                if($route.current.templateUrl == 'main.html'){
                    setTimeout(getTemperature,Settings.frequence*1000);
                }
            }
        });
    };

      getTemperature();

  }]);

app.controller('NameSearchListCtrl', ['$scope','NameSearchList','SearchListCtrlFunc',
    function($scope,  NameSearchList, SearchListCtrlFunc) {
        return SearchListCtrlFunc($scope,NameSearchList);
    }]);


app.directive('whenScrolled', function() {
    return function(scope, elm, attr) {
        var raw = elm[0];

        elm.bind('scroll', function() {
            if ((raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) && !scope.firstPage ){
                scope.$apply(attr.whenScrolled);
                console.log('start scrolled.' + '  raw.scrollTop is: ' + raw.scrollTop + '  raw.offsetHeight is: ' + raw.offsetHeight + '  raw.scrollHeight is: ' + raw.scrollHeight);
            }

            scope.firstPage = false;
        });
    };
});