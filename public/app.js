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