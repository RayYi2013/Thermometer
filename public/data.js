var app = angular.module('myApp.services', []);

app.service('Settings',function (){
    this.format = 'c';  //c: Celsius, f: Fahrenheit

    this.frequence = 5; // seconds

    this.thresholds = [
        {name:'Freeze', point:0, flunctuation:0.5, direction:{up:false,down:false}},
        {name:'Boiler', point:100, flunctuation:0.5, direction:{up:false,down:false}}
    ];

    this.findThreshold = function(temperature){
        var threshold = null;
        angular.forEach(this.thresholds,function(item,index){
            if((item.point - item.flunctuation)<=temperature && temperature <= (item.point + item.flunctuation)){
                threshold = item;
            }
        });
        return threshold;
    };

});


app.factory('TemperatureService', function($http) {
    var myService = {
        getTemperature: function() {
            // $http returns a promise, which has a then function, which also returns a promise
            var promise = $http.get('/thermometer', {})
                .then(function (response) {
                    // The then function here is an opportunity to modify the response
                    console.log(response);
                    // The return value gets picked up by the then in the controller.
                    // return Celsius
                    return response.data.temperature;
                });
            // Return the promise to the controller
            return promise;
        }
    };
    return myService;
});

app.factory('MainCtrlHelper', function() {
    var myService = {
        getFormatedTemperature: function(Settings, temperature) {
            // temperature is Celsius
            if(Settings.format == 'f'){
                //convert Celsius to Fahrenheit.
                var tc=parseInt(temperature);
                var tf=((9/5)*tc)+32;
                return Math.round(tf*Math.pow(10,2))/Math.pow(10,2);
            }
            else{
                return temperature;
            }

        },
        checkThreshold: function($scope, Settings, temperature) {
            $scope.temperature = this.getFormatedTemperature(Settings,temperature);

            var threshold = Settings.findThreshold(temperature);
            var reachThreshold = false;
            if(threshold){
                $scope.direction = '';
                var changed = false;
                if(!$scope.threshold){
                    changed = true;
                }
                else{
                    changed = $scope.threshold.name != threshold.name
                }


                if(changed){
                    if(threshold.direction.up || threshold.direction.down){
                        if(threshold.direction.up && ($scope.currentTemperature < temperature)){
                            $scope.direction = 'up';
                        }
                        if(threshold.direction.down && ($scope.currentTemperature > temperature)){
                            $scope.direction = 'down';
                        }

                        if($scope.direction.length>0){
                            reachThreshold = changed;
                        }
                    }
                    else{
                        reachThreshold = changed;
                    }
                    $scope.threshold = threshold;
                }
            }

            return reachThreshold;
        }
    };
    return myService;
});

