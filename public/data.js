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

