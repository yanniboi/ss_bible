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

    .service('Streak', ['$rootScope', '$ionicPopup', '$window', function ($rootScope, $ionicPopup, $window) {
    
        
        this.show = function () {
            //Temp
            //$rootScope.streak.current = 7;
            //$rootScope.streak.highscore = 6;

            var state = '',
                title = 'Good Job';

            $rootScope.streakNumber = Math.abs($rootScope.streak.current - $rootScope.streak.highscore);
            $rootScope.showNumber = true;
            $rootScope.streakMessage = "Great Job";

            if ($rootScope.streak.current < $rootScope.streak.highscore) {
                state = 'chase';
                title = 'You are Gaining';
                $rootScope.streakMessage = "behind your Highscore";
            } 
            else if ($rootScope.streak.current > $rootScope.streak.highscore) {
                state = 'lead';
                title = 'You are Ahead';
                $rootScope.streakMessage = "That's a new Highscore!!!";
                $rootScope.showNumber = false;
            }
            else {
                state = 'equal';
                title = 'Head to Head';
                $rootScope.streakMessage = "You are one day away from a new Highscore!";
                $rootScope.showNumber = false;
                //$rootScope.streakMessage = "You are right on target for a new Highscore";
            }

            $rootScope.streak.state = state;
            
            
            $ionicPopup.show({
                title: title,
                templateUrl: "templates/streak-popup.html",
                scope: $rootScope,
                //subTitle: 'Looks like you haven\'t got the Facebook App installed',
                buttons: [
                  { text: 'Close' }
                ]
            });
        }
    }])