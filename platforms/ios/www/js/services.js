angular.module('bioy.services', ['http-auth-interceptor'])
    .factory('Utils', ['$rootScope', '$ionicLoading', '$window', function ($rootScope, $ionicLoading, $window) {
        $rootScope.show = function (text) {
            $rootScope.loading = $ionicLoading.show({
                content: text ? text : 'Loading...',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
        };

        $rootScope.hide = function () {
            $ionicLoading.hide();
        };

        $rootScope.notify =function(text){
            $rootScope.show(text);
            $window.setTimeout(function () {
              $rootScope.hide();
            }, 1999);
        };
    }])