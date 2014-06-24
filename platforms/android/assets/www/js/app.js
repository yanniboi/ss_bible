// Ionic Bible in One Year App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'bioy' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'bioy.controllers' is found in controllers.js
// 'bioy.directives' is found in directives.js
// 'bioy.memeryServices' is found in memory-services.js
// 'bioy.services' is found in services.js
angular.module('bioy', [
    'ionic',
    'bioy.controllers',
    'bioy.directives',
    'bioy.memoryServices',
    'bioy.services',
    'jaydata',
    'LocalStorageModule',
    'ngMockE2E' // Take out after site authentication is configured
])


    .run(['$rootScope', '$ionicPlatform', '$httpBackend', '$http', function ($rootScope, $ionicPlatform, $httpBackend, $http) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if(window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
        
        // -------- Start of mock code ---------
        
        // Mocking code used for simulation purposes (using ngMockE2E module)	
        var authorized = false;

        // returns the current list of customers or a 401 depending on authorization flag
        $httpBackend.whenGET('https://customers').respond(function (method, url, data, headers) {
            return authorized ? [200] : [401];
        });

        $httpBackend.whenPOST('https://login').respond(function(method, url, data) {
            //authorized = true;
            authorized = true;
            return  [200 , { authorizationToken: "NjMwNjM4OTQtMjE0Mi00ZWYzLWEzMDQtYWYyMjkyMzNiOGIy" } ];
        });

        $httpBackend.whenPOST('https://logout').respond(function(method, url, data) {
            authorized = false;
            return [200];
        });

        // All other http requests will pass through
        $httpBackend.whenGET(/.*/).passThrough();
        
        // -------- End of mock code ---------
  
    }])

    // Set up our routing and state structure
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

        .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "templates/menu.html",
            controller: 'AppCtrl'
        })

        .state('app.home', {
            url: "/home",
            views: {
                'menuContent' :{
                    templateUrl: "templates/home.html",
                    controller: 'HomeCtrl'
                }
            }
        })
        
        /*.state('login', {
            url: "/login",
                    templateUrl: "templates/login.html",
                    controller: 'LoginCtrl'
        })*/

        .state('app.search', {
            url: "/search",
            views: {
                'menuContent' :{
                    templateUrl: "templates/search.html",
                    controller: 'SearchCtrl'
                }
            }
        })

        .state('app.browse', {
            url: "/browse",
            views: {
                'menuContent' :{
                    templateUrl: "templates/browse.html",
                    controller: 'DaysCtrl'
                }
            }
        })

        .state('app.settings', {
            url: "/settings",
            views: {
                'menuContent' :{
                    templateUrl: "templates/settings.html",
                    controller: 'SettingsCtrl'
                }
            }
        })
        
        .state('app.recent', {
            url: "/recent",
            views: {
                'menuContent' :{
                    templateUrl: "templates/recent.html",
                    controller: 'RecentCtrl'
                }
            }
        })

        .state('app.day', {
            url: "/days/:dayId",
            views: {
                'menuContent' :{
                    templateUrl: "templates/day-detail.html",
                    controller: 'DayDetailCtrl'
                }
            }
        });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/home');
    });

