// Ionic Bible in One Year App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'bioy' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'bioy.controllers' is found in controllers.js
angular.module('bioy', [
    'ionic',
    'bioy.controllers',
    'bioy.memoryServices'
])

.run(function($ionicPlatform) {
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
})

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
            templateUrl: "templates/home.html"
        }
    }
  })
  
    .state('app.search', {
      url: "/search",
      views: {
        'menuContent' :{
          templateUrl: "templates/search.html"
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

