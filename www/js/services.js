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

        $rootScope.trim = function(str) {
            return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
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
        
        // Method to check for internet connection.
        $rootScope.checkNetwork = function () {
            //@TODO remove debug for production.
            if (typeof navigator.connection === 'undefined') {
                return true;
                // Temp for checking offline behaviour
                //return false;
            }
            else if (navigator.connection.type == 0) {
                console.log('Connection not accessible');
                return true;
            }
            else if (navigator.connection.type == Connection.NONE) {
                return false;
            }
            return true;
        };
    }])

    .factory('Books', function() {
        return {
            "Genesis" : "GEN",
            "Exodus" : "EXO",
            "Leviticus" : "LEV",
            "Numbers" : "NUM",
            "Deuteronomy" : "DEU",
            "Joshua" : "JOS",
            "Judges" : "JDG",
            "Ruth" : "RUT",
            "1 Samuel" : "1SA",
            "2 Samuel" : "2SA",
            "1 Kings" : "1KI",
            "2 Kings" : "2KI",
            "1 Chronicles" : "1CH",
            "2 Chronicles" : "2CH",
            "Ezra" : "EZR",
            "Nehemiah" : "NEH",
            "Esther" : "EST",
            "Job" : "JOB",
            "Psalms" : "PSA",
            "Proverbs" : "PRO",
            "Ecclesiastes" : "ECC",
            "Song of Solomon" : "SNG",
            "Isaiah" : "ISA",
            "Jeremiah" : "JER",
            "Lamentations" : "LAM",
            "Ezekiel" : "EZK",
            "Daniel" : "DAN",
            "Hosea" : "HOS",
            "Joel" : "JOL",
            "Amos" : "AMO",
            "Obadiah" : "OBA",
            "Jonah" : "JON",
            "Micah" : "MIC",
            "Nahum" : "NAM",
            "Habakkuk" : "HAB",
            "Zephaniah" : "ZEP",
            "Haggai" : "HAG",
            "Zechariah" : "ZEC",
            "Malachi" : "MAL",
            "Matthew" : "MAT",
            "Mark" : "MRK",
            "Luke" : "LUK",
            "John" : "JHN",
            "Acts" : "ACT",
            "Romans" : "ROM",
            "1 Corinthians" : "1CO",
            "2 Corinthians" : "2CO",
            "Galatians" : "GAL",
            "Ephesians" : "EPH",
            "Philippians" : "PHP",
            "Colossians" : "COL",
            "1 Thessalonians" : "1TH",
            "2 Thessalonians" : "2TH",
            "1 Timothy" : "1TI",
            "2 Timothy" : "2TI",
            "Titus" : "TIT",
            "Philemon" : "PHM",
            "Hebrews" : "HEB",
            "James" : "JAS",
            "1 Peter" : "1PE",
            "2 Peter" : "2PE",
            "1 John" : "1JN",
            "2 John" : "2JN",
            "3 John" : "3JN",
            "Jude" : "JUD",
            "Revelation" : "REV"
        }
    })

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
    }]);