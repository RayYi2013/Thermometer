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
        expect(ctrlScope.directoin).toBe('');
        expect(ctrlScope.threshold).toBeUndefined();
        expect(ctrlScope.format).toBe(Settings.format);
    }));

    it('should set temperature', inject(function ($controller, $httpBackend) {
        Settings.thresholds[0].direction.up=true;
        temperature = -1;
        $httpBackend.expectGET('/thermometer').respond({temperature:temperature});
        var ctrl = $controller('MainCtrl', { $scope: ctrlScope, $route:route});
        $httpBackend.flush();
        expect(ctrlScope.temperature).toEqual(temperature);
        expect(ctrlScope.directoin).toBe('');
        expect(ctrlScope.threshold).toBeUndefined();
        expect(ctrlScope.format).toBe(Settings.format);

        temperature = 0;
        $httpBackend.expectGET('/thermometer').respond({temperature:temperature});
        //var ctrl = $controller('MainCtrl', { $scope: ctrlScope, $route:route});
        $httpBackend.flush();
        expect(ctrlScope.temperature).toEqual(temperature);
        expect(ctrlScope.directoin).toBe('up');
        expect(ctrlScope.threshold).toBeDefined();
    }));


});