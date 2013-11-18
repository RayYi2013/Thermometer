describe("Settings", function () {

    var Settings;

    //Loading shopping module
    beforeEach(function () {
        //module("myApp.services");
        var $injector = angular.injector([ 'myApp.services' ]);
        Settings = $injector.get( 'Settings' );
    });



    it('should contain an Settings', function () {
        expect(Settings).not.toBeNull();
    });

    it('should contain an findThreshold', function () {
        expect(Settings.findThreshold).toBeDefined();
    });

    it('should find temperature freezing', function () {
        var t;
        t = Settings.findThreshold(0);
        expect(t).not.toBeNull();
        t = Settings.findThreshold(0.5);
        expect(t).not.toBeNull();
        t = Settings.findThreshold(-0.5);
        expect(t).not.toBeNull();
        t = Settings.findThreshold(-0.3);
        expect(t).not.toBeNull();
        t = Settings.findThreshold(0.3);
        expect(t).not.toBeNull();
    });

    it('should find temperature boiler', function () {
        var t;
        t = Settings.findThreshold(100);
        expect(t).not.toBeNull();
        t = Settings.findThreshold(100.5);
        expect(t).not.toBeNull();
        t = Settings.findThreshold(99.5);
        expect(t).not.toBeNull();
        t = Settings.findThreshold(99.7);
        expect(t).not.toBeNull();
        t = Settings.findThreshold(100.3);
        expect(t).not.toBeNull();
    });

    it('should not find temperature 39', function () {
        var t;
        t = Settings.findThreshold(39);
        expect(t).toBeNull();
    });


});

describe("MainCtrlHelper", function () {

    var MainCtrlHelper, ctrlScope,Settings, temperature;

    //Loading shopping module
    beforeEach(function () {
        //module("myApp.services");
        module("myApp");

        var $injector = angular.injector([ 'myApp.services' ]);
        Settings = $injector.get( 'Settings' );
        MainCtrlHelper = $injector.get( 'MainCtrlHelper' );
    });

    describe("getFormatedTemperature", function () {
        it('should get Celsius temperature', function () {
            temperature = 10;
            var r;
            r = MainCtrlHelper.getFormatedTemperature(Settings,temperature);
            expect(r).toEqual(temperature);

            //10c to 5of
            Settings.format='f';
            r = MainCtrlHelper.getFormatedTemperature(Settings,temperature);
            expect(r).toEqual(50);

        });


    });

    describe("checkThreshold", function () {

        beforeEach(inject(function ($rootScope) {
            ctrlScope = $rootScope.$new();
        }));

        it('should not get threshold', function () {
            temperature = 10;

            MainCtrlHelper.checkThreshold(ctrlScope, Settings,temperature);
            expect(ctrlScope.threshold).toBeUndefined();
        });

        it('should get threshold', function () {
            temperature = 0;

            MainCtrlHelper.checkThreshold(ctrlScope, Settings,temperature);
            expect(ctrlScope.threshold).toBeDefined();
            expect(ctrlScope.threshold.name).toEqual(Settings.thresholds[0].name);
        });


        it('should reach threshold once', function () {
            var reachThreshold = false;
            temperature = 5;
            reachThreshold = MainCtrlHelper.checkThreshold(ctrlScope, Settings,temperature);
            expect(reachThreshold).toBeFalsy();

            temperature = 0;
            reachThreshold = MainCtrlHelper.checkThreshold(ctrlScope, Settings,temperature);
            expect(reachThreshold).toBeTruthy();

            temperature = 0.5;
            reachThreshold = MainCtrlHelper.checkThreshold(ctrlScope, Settings,temperature);
            expect(reachThreshold).toBeFalsy();

            temperature = -0.5;
            reachThreshold = MainCtrlHelper.checkThreshold(ctrlScope, Settings,temperature);
            expect(reachThreshold).toBeFalsy();

            temperature = -3;
            reachThreshold = MainCtrlHelper.checkThreshold(ctrlScope, Settings,temperature);
            expect(reachThreshold).toBeFalsy();
        });

        it('should get down direction', function () {
            Settings.thresholds[0].direction.down = true;

            ctrlScope.direction = '';

            temperature = 5;
            reachThreshold = MainCtrlHelper.checkThreshold(ctrlScope, Settings,temperature);
            ctrlScope.currentTemperature = temperature;
            expect(ctrlScope.threshold).toBeUndefined();
            expect(reachThreshold).toBeFalsy();
            expect(ctrlScope.direction).toBe('');

            temperature = 0;
            reachThreshold = MainCtrlHelper.checkThreshold(ctrlScope, Settings,temperature);
            ctrlScope.currentTemperature = temperature;
            expect(ctrlScope.threshold).toBeDefined();
            expect(reachThreshold).toBeTruthy();
            expect(ctrlScope.direction).toEqual('down');

            temperature = 0.5;
            reachThreshold = MainCtrlHelper.checkThreshold(ctrlScope, Settings,temperature);
            ctrlScope.currentTemperature = temperature;
            expect(ctrlScope.threshold).toBeDefined();
            expect(reachThreshold).toBeFalsy();
            expect(ctrlScope.direction).toBe('');
        });

        it('should get up direction', function () {
            Settings.thresholds[0].direction.down = false;
            Settings.thresholds[0].direction.up = true;

            ctrlScope.direction = '';

            temperature = -5;
            reachThreshold = MainCtrlHelper.checkThreshold(ctrlScope, Settings,temperature);
            ctrlScope.currentTemperature = temperature;
            expect(ctrlScope.threshold).toBeUndefined();
            expect(reachThreshold).toBeFalsy();
            expect(ctrlScope.direction).toBe('');

            temperature = 0;
            reachThreshold = MainCtrlHelper.checkThreshold(ctrlScope, Settings,temperature);
            ctrlScope.currentTemperature = temperature;
            expect(ctrlScope.threshold).toBeDefined();
            expect(reachThreshold).toBeTruthy();
            expect(ctrlScope.direction).toEqual('up');

            temperature = 0.5;
            reachThreshold = MainCtrlHelper.checkThreshold(ctrlScope, Settings,temperature);
            ctrlScope.currentTemperature = temperature;
            expect(ctrlScope.threshold).toBeDefined();
            expect(reachThreshold).toBeFalsy();
            expect(ctrlScope.direction).toBe('');
        });


    });


});
describe("MainCtrl", function () {

    var ctrlScope,Settings, temperature,route;

    //Loading shopping module
    beforeEach(function () {
        //module("myApp.services");
        module("myApp");

        var $injector = angular.injector([ 'myApp.services' ]);
        Settings = $injector.get( 'Settings' );
    });

    beforeEach(inject(function ($rootScope) {
        route = {current:{templateUrl:''}};
        ctrlScope = $rootScope.$new();
    }));



    it('should set temperature', inject(function ($controller, $httpBackend) {
        temperature = 10;
        $httpBackend.expectGET('/thermometer').respond({temperature:temperature});
        var ctrl = $controller('MainCtrl', { $scope: ctrlScope, $route:route});
        $httpBackend.flush();
        expect(ctrlScope.temperature).toEqual(temperature);
        expect(ctrlScope.direction).toBe('');
        expect(ctrlScope.threshold).toBeUndefined();
        expect(ctrlScope.format).toBe(Settings.format);
    }));


});