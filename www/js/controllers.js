angular.module('bioy.controllers', [])

    .controller('AppCtrl', ['$scope', '$rootScope', '$state', '$ionicModal', 'Day', function ($scope, $rootScope, $state, $ionicModal, Day) {
        if ($scope.login == null) {
            $scope.login = false;
        }

        $rootScope.showLoading = true;

        $rootScope.$watch('showLoading', function () {
            $scope.showLoading = $rootScope.showLoading;
            if (!$scope.showLoading) {
                angular.element(document.querySelectorAll('.menu-loading')).addClass('hidden');
            }
        });

        $scope.hideBackButton = true;

        // Set up global variables
        $rootScope.isLoggedIn = $scope.isLoggedIn = JSON.parse(window.localStorage.getItem('user_login'));
        $rootScope.shownGroup = null;
        $rootScope.CurrentDay = window.localStorage.getItem('currentDay');
        
        // Streak variables.
        $rootScope.streak = {
            today: new Date().setHours(0,0,0,0),
            current: window.localStorage.getItem('streak_current'),
            highscore: window.localStorage.getItem('streak_highscore'),
            update: window.localStorage.getItem('streak_update')
        };

        $scope.days = [];

        $scope.settings = function () {
            $scope.menuModal.hide();
            $state.go('app.settings');
        };

        $ionicModal.fromTemplateUrl('templates/settings-menu.html', {
            scope: $scope,
            animation: 'slide-right-left'
        }).then(function(modal) {
            $scope.menuModal = modal;
        });

        $scope.settingsMenu = function () {
            $scope.menuModal.show();
        };

        $scope.goLogin = function () {
            $scope.menuModal.hide();
            $state.go('app.login');
            $scope.menuModal.hide();

        };

        // Demo dates @todo remove.
        //$rootScope.streak.update = 1307106800000;
        //$rootScope.streak.today = 1407193200000;
        
        if (($rootScope.streak.today - $rootScope.streak.update) > 86400000) {
            $rootScope.streak.highscore = $rootScope.streak.current
            window.localStorage.setItem('streak_highscore', $rootScope.streak.current);
            
            $rootScope.streak.current = 0
            window.localStorage.setItem('streak_current', 0);
        }
        
        // Refresh the database from server.
        Day.refresh();

        $ionicModal.fromTemplateUrl(
            'templates/login.html',
            function(modal) {
                $scope.loginModal = modal;
            },
            {
                scope: $scope,
                animation: 'slide-in-up',
                focusFirstInput: true
            }
        );
        //Be sure to cleanup the modal by removing it from the DOM
        $scope.$on('$destroy', function() {
            $scope.loginModal.remove();
        });

        $rootScope.$watch('menuDays', function () {
            $scope.days = $rootScope.menuDays;
        });

        function rebuildMenu () {
            $scope.days = [];
            Day.refreshMenu();
        }
        
        // Create the event.
        $rootScope.menuRefreshEvent = document.createEvent('Event');

        // Define that the event name is 'build'.
        $rootScope.menuRefreshEvent.initEvent('rebuildmenu', true, true);

        // Listen for the event.
        window.addEventListener('rebuildmenu', rebuildMenu, false);

        // Logout action to logout user.
        $scope.doLogout = function() {
            window.localStorage.setItem('user_login', 0);
            window.localStorage.setItem('user_uid', 0);
            $rootScope.isLoggedIn = 0;
            $scope.isLoggedIn = 0;
        };

        // Opens login dialog
        $scope.doLogin = function() {
            $scope.loginModal.show();
        }
        
        
    }])

    .controller('HomeCtrl', ['$state', '$scope', '$rootScope', '$ionicModal', 'Utils', 'Day', function ($state, $scope, $rootScope, $ionicModal, Utils, Day) {
        //var isLoggedIn = JSON.parse(window.localStorage.getItem('user_login'));

        $scope.startReading = function () {
            Day.getStartDay();
        };

        $scope.shareApp = function () {
            //<button onclick="window.plugins.socialsharing.share('Message only')">message only</button>
            //<button onclick="window.plugins.socialsharing.share('Message and subject', 'The subject')">message and subject</button>
            //<button onclick="window.plugins.socialsharing.share(null, null, null, 'http://www.x-services.nl')">link only</button>
            window.plugins.socialsharing.share('Checkout soulsurvivors new Bible in One Year App!', null, null, 'https://play.google.com/store/apps/details?id=com.soulsurvivor.bioy');
            //<button onclick="window.plugins.socialsharing.share(null, null, 'https://www.google.nl/images/srpr/logo4w.png', null)">image only</button>
// Beware: passing a base64 file as 'data:' is not supported on Android 2.x: https://code.google.com/p/android/issues/detail?id=7901#c43
// Hint: when sharing a base64 encoded file on Android you can set the filename by passing it as the subject (second param)
            //<button onclick="window.plugins.socialsharing.share(null, 'Android filename', 'data:image/png;base64,R0lGODlhDAAMALMBAP8AAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAUKAAEALAAAAAAMAAwAQAQZMMhJK7iY4p3nlZ8XgmNlnibXdVqolmhcRQA7', null)">base64 image only</button>
// Hint: you can share multiple files by using an array as thirds param: ['file 1','file 2', ..], but beware of this Android Kitkat Facebook issue: [#164]
            //<button onclick="window.plugins.socialsharing.share('Message and image', null, 'https://www.google.nl/images/srpr/logo4w.png', null)">message and image</button>
            //<button onclick="window.plugins.socialsharing.share('Message, image and link', null, 'https://www.google.nl/images/srpr/logo4w.png', 'http://www.x-services.nl')">message, image and link</button>
            //<button onclick="window.plugins.socialsharing.share('Message, subject, image and link', 'The subject', 'https://www.google.nl/images/srpr/logo4w.png', 'http://www.x-services.nl')">message, subject, image and link</button>
        };

        var isLoggedIn = $rootScope.isLoggedIn;
        
        if (isLoggedIn) {
            var username = window.localStorage.getItem('user_name');
            $scope.welcome = "Hello " + username + '...';
        }
        else {
            $scope.welcome = "Hello little ones...";
        }

        $scope.showMessage = function () {
            var text = "Please enter valid credentials";
            $rootScope.notify(text);
        };

    }])

    /**
     * Settings controller to handle Settings and Login
     */
    .controller('SettingsCtrl', ['$state', '$scope', '$rootScope', 'localStorageService', function ($state, $scope, $rootScope, localStorageService) {
        // Array for storing settings values.
        $scope.settings = {
            // @TODO think of some settings to use.
            //'lightsabre': window.localStorage.getItem('lightsabre'),
            //'download': JSON.parse(window.localStorage.getItem('download'))
        };
        
        // Save action for save button.
        $scope.save = function () {
            //window.localStorage.setItem('lightsabre', $scope.settings.lightsabre);
            //window.localStorage.setItem('download', $scope.settings.download);
            $state.go('app.home');            
        };
        
        // Boolean to determin whether user is logged in.
        //$scope.isLoggedIn = JSON.parse(window.localStorage.getItem('user_login'));
        $scope.isLoggedIn = $rootScope.isLoggedIn;
        $rootScope.$watch('isLoggedIn', function() {
            $scope.isLoggedIn = $rootScope.isLoggedIn;
        });
        
        // Logout action to logout user.
        $scope.doLogout = function() {
            window.localStorage.setItem('user_login', 0);
            window.localStorage.setItem('user_uid', 0);
            $rootScope.isLoggedIn = 0;
            $scope.isLoggedIn = 0;
            $rootScope.notify('Logged out successfully');
        };
        
        // Opens login dialog
        $scope.doLogin = function() {
            $state.go('app.login');
        }
    }])

    /**
     * Login controller to handle user login.
     */
    .controller('LoginCtrl', ['$scope', '$rootScope', '$state', '$http', '$ionicPopup', 'Utils', function ($scope, $rootScope, $state, $http, $ionicPopup, Utils) {
        // If username already stored load the default.
        $scope.user = {};

        $scope.regUser = {};

        // Create variable to be used for authentication feedback.
        $scope.message = "";

        $scope.register = function() {
// Check details have been entered.
            if(!$scope.regUser.username || !$scope.regUser.password || !$scope.regUser.email) {
                $rootScope.notify("Please enter valid credentials");
                return false;
            }

            // Send a post request to the rest api.
            //var url = "http://soulsurvivor.bible/phonegap/user/login/";
            var url = "http://bible.soulsurvivor.com/phonegap/user";
            var method = "POST";
            var postData = '{ "name" : "' + $scope.regUser.username + '", "password" : "' + $scope.regUser.password + '", "mail" : "' + $scope.regUser.email + '", "status" : 1 }';

            // You REALLY want async = true.
            // Otherwise, it'll block ALL execution waiting for server response.
            var async = true;
            var request = new XMLHttpRequest();

            // Define what to do with response.
            request.onload = function () {

                // You can get all kinds of information about the HTTP response.
                var status = request.status; // HTTP response status, e.g., 200 for "200 OK"
                $rootScope.hide();
                if (status == 200) {

                    var data =  JSON.parse(request.responseText); // Returned data, e.g., an HTML document.

                    // Store user data
                    window.localStorage.setItem('user_name', $scope.regUser.username);
                    //window.localStorage.setItem('user_password', $scope.user.password);
                    window.localStorage.setItem('user_uid', data.uid);
                    window.localStorage.setItem('user_login', 1);

                    $rootScope.isLoggedIn = 1;

                    $rootScope.hide();
                    $scope.message = "Register Successful!";
                    $rootScope.notify($scope.message);
                    $scope.loginModal.remove();
                    // Redirect to home page.
                    $state.go('app.home');
                }
                else {
                    var data =  JSON.parse(request.responseText); // Returned data, e.g., an HTML document.
                    if (data.form_errors) {
                        if (data.form_errors.mail) {
                            $scope.message = data.form_errors.mail;

                            var substr = 'The e-mail address <em class="placeholder">' + $scope.regUser.email + '</em> is already',
                                length = substr.length;

                            if ($scope.message.substring(0, length) == substr) {
                                $scope.message = 'The e-mail address ' + $scope.regUser.email + ' is already registered';
                            }
                        }
                        if (data.form_errors.name) {
                            $scope.message = data.form_errors.name;
                        }
                    }
                    // Show error message to user.
                    $rootScope.hide();
                    //$scope.message = "Your details are incorrect. Please try again.";
                    $rootScope.notify($scope.message);
                    $scope.user.password = null;
                    console.log('error with connection. status: '+ status);
                }
            };

            // Build the request object.
            $rootScope.show("Logging in...");
            request.open(method, url, async);

            // Set headers.
            request.setRequestHeader("Content-Type", "application/json");
            request.setRequestHeader("Accept", "application/json");

            // Actually sends the request to the server.
            request.send(postData);        };

        // Action to handle login.
        $scope.login = function() {
            // Check details have been entered.
            if(!$scope.user.username || !$scope.user.password) {
                $rootScope.notify("Please enter valid credentials");
                return false;
            }
            
            // Send a post request to the rest api.
            //var url = "http://soulsurvivor.bible/phonegap/user/login/";
            var url = "http://bible.soulsurvivor.com/phonegap/user/login/";
            var method = "POST";
            var postData = '{ "username" : "' + $scope.user.username + '", "password" : "' + $scope.user.password + '" }';

            // You REALLY want async = true.
            // Otherwise, it'll block ALL execution waiting for server response.
            var async = true;
            var request = new XMLHttpRequest();
            
            // Define what to do with response.
            request.onload = function () {

                // You can get all kinds of information about the HTTP response.
                var status = request.status; // HTTP response status, e.g., 200 for "200 OK"
                $rootScope.hide();
                if (status == 200) {
                   
                    var data =  JSON.parse(request.responseText); // Returned data, e.g., an HTML document.
                    
                    // Store user data
                    window.localStorage.setItem('user_name', $scope.user.username);
                    window.localStorage.setItem('user_password', $scope.user.password);
                    window.localStorage.setItem('user_uid', data.user.uid);
                    window.localStorage.setItem('user_login', 1);
                    
                    $rootScope.isLoggedIn = 1;

                    $rootScope.hide();
                    $scope.message = "Login Successful!";
                    $rootScope.notify($scope.message);
                    $scope.loginModal.remove();
                    // Redirect to home page.
                    $state.go('app.home');
                }
                else {

                    var data =  JSON.parse(request.responseText); // Returned data, e.g., an HTML document.
                    $scope.message = "Your details are incorrect. Please try again.";

                    if (data[0]) {
                        $scope.message = data[0];
                    }

                    // Show error message to user.
                    $rootScope.hide();
                    $rootScope.notify($scope.message);
                    $scope.user.password = null;
                    console.log('error with connection. status: '+ status);
                }
            };

            // Build the request object.
            $rootScope.show("Logging in...");
            request.open(method, url, async);

            // Set headers.
            request.setRequestHeader("Content-Type", "application/json");
            request.setRequestHeader("Accept", "application/json");

            // Actually sends the request to the server.
            request.send(postData);            
        };
        
    }])

    /**
     * Controller for dealing with the Detailed Day view.
     */
    .controller('DayDetailCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$ionicPopup', '$http', 'Day', 'Utils', 'Streak', function ($scope, $rootScope, $state, $stateParams, $ionicPopup, $http, Day, Utils, Streak) {
        // Get the data from the database
        var dayDB = Day.query;
        $scope.instructions = "Click 'Mark as Read' to indicate you have seen this Video!";
        $scope.$watch('day.read', function() {
            if ($scope.day.read) {
                $scope.instructions = "Congratulations. You have watched this video.";
            }
            else {
                $scope.instructions = "Click 'Mark as Read' to indicate you have seen this Video!";
            }
        });

        $scope.hideBackButton = true;

        $scope.day = [];
        $scope.nid = $stateParams.dayId;
        $rootScope.notify();
        
        dayDB.onReady(function() {
            var storedData = dayDB.Days
                .filter(" it.nid == param ",{param: $scope.nid}).toLiveArray();
            storedData.then(function (results) {
                if (results.length) {
                    $scope.day = {
                        'title' : results[0].title,
                        'body' : results[0].body,
                        'dayId' : results[0].day,
                        'created' : results[0].created * 1000,
                        'nid' : results[0].nid,
                        'read_count' : results[0].read_count,
                        'comment_count' : results[0].comment_count,
                        'youtube' : results[0].youtube,
                        'subtitle' : results[0].subtitle,
                        'read' : results[0].read
                    };
                    //$scope.init();
                    dayDB.saveChanges();
                    $rootScope.hide();
                }
            });
        });
        
        // An alert dialog
        $scope.showPopup = function (number) {
            var alertPopup = $ionicPopup.alert({
                title: 'Psalm 90:2,4 NIV! ' + number,
                templateUrl: "templates/verse.html"
            });
            alertPopup.then(function (res) {
                console.log('Thank you for not eating my delicious ice cream cone');
            });

            // Scroll to top!
            setTimeout( function () {
                jQuery('.popup-showing').animate({ scrollTop: 0 }, "slow");
            }, 500 );
        };

        
        $scope.markRead = function () {
            $scope.day.read = 1;
            
            var dayTestDB = new DayDatabase({
                provider: 'sqLite' , databaseName: 'MyDayDatabase'
            });
            dayTestDB.onReady(function() {
                var existingTasks = dayTestDB.Days.filter("nid", "==", $scope.day.nid).toLiveArray();
                existingTasks.then(function(results) {
                    var todo = dayTestDB.Days.attachOrGet($scope.day);
                    todo.read = 1;
                    todo.created = results[0].created;
                    todo.read_count = results[0].read_count + 1;
                    $scope.day.read_count++;

                    dayTestDB.saveChanges().then(function () {
                        window.localStorage.setItem('currentDay', $scope.day.dayId);
                        $rootScope.CurrentDay = $scope.day.dayId;
                        window.dispatchEvent($rootScope.menuRefreshEvent);
                    });

                    // Update the website
                    if ($rootScope.isLoggedIn) {
                        var uid = JSON.parse(window.localStorage.getItem('user_uid')),
                            nid = $scope.day.nid,
                            //url = "http://soulsurvivor.bible/rest/user/" + uid + "/node/" + nid + "/read";
                            url = "http://bible.soulsurvivor.com/rest/user/" + uid + "/node/" + nid + "/read";
                        $http({method: 'GET', url: url});
                    }
                });
            });
            
            // Show streak popup
            if ($rootScope.streak.update < $rootScope.streak.today) {
                $rootScope.streak.update = $rootScope.streak.today;
                window.localStorage.setItem('streak_update', $rootScope.streak.update);
                
                $rootScope.streak.current++;
                window.localStorage.setItem('streak_current', $rootScope.streak.current);

                Streak.show();
            }

            // Continue to the next day.
            $scope.continueReading = function () {
                Day.getStartDay();
            };
        };

        $scope.shareDay = function () {
            window.plugins.socialsharing.share('I just watched ' + $scope.day.title + ' on Youtube!', null, null, 'https://www.youtube.com/watch?v=' + $scope.day.youtube);
        };
        
        $scope.markUnread = function () {
            $scope.day.read = 0;
            
            var dayTestDB = new DayDatabase({
                provider: 'sqLite' , databaseName: 'MyDayDatabase'
            });
            dayTestDB.onReady(function() {
                var existingTasks = dayTestDB.Days.filter("nid", "==", $scope.day.nid).toLiveArray();
                existingTasks.then(function(results) {
                    var todo = dayTestDB.Days.attachOrGet($scope.day);
                    todo.read = 0;
                    todo.created = results[0].created;
                    todo.read_count = results[0].read_count - 1;
                    $scope.day.read_count--;

                    dayTestDB.saveChanges().then(function () {
                        window.dispatchEvent($rootScope.menuRefreshEvent);
                    });
                    
                    // Update the website
                    if ($rootScope.isLoggedIn) {
                        var uid = JSON.parse(window.localStorage.getItem('user_uid')),
                            nid = $scope.day.nid,
                            //url = "http://soulsurvivor.bible/rest/user/" + uid + "/node/" + nid + "/unread";
                            url = "http://bible.soulsurvivor.com/rest/user/" + uid + "/node/" + nid + "/unread";
                        $http({method: 'GET', url: url});
                    }
                });
            });

        };
        
        $scope.verses = ['Lamentations 2:13 - 3:14', 'Philemon 1', 'Psalm 23 - 24'];
        
        $scope.verseNotify = function(num) {
            $rootScope.notify($scope.verses[num]);
        }
        
        $scope.iPhonePortrait = window.matchMedia("(max-width: 568px)").matches;
        
        window.addEventListener(
            "resize",
            function () {
                $scope.iPhonePortrait = window.matchMedia("(max-width: 568px)").matches;
                $state.reload();
            },
            true);
        
        $scope.showYoutube = function () {
            if (!$rootScope.checkNetwork()) {
                $rootScope.notify("You are not connected to the internet...");
            }
            else {
                var vidVid = document.createElement("iframe");
                vidVid.setAttribute("width", "300");
                vidVid.setAttribute("height", "315");
                vidVid.setAttribute("src", "http://www.youtube.com/embed/" + $scope.day.youtube + "?modestbranding=1&rel=0&theme=light&color=white&autohide=0&disablekb=1");
                vidVid.setAttribute("frameborder", "0");
                vidVid.setAttribute("autoplay", "true");
                vidVid.setAttribute("allowfullscreen", "true");

                var vidEl = document.getElementById("streamed-video");
                vidEl.appendChild(vidVid); 

                var vidPrev = document.getElementById("video-preview");
                vidPrev.style.display = 'none';
            }
        }
        
        $scope.comment = function() {
            window.open('http://bible.soulsurvivor.com/node/' + $scope.nid + '#comment-form', '_system');
        }
        
        $scope.share = function() {
            window.plugins.socialsharing.shareViaFacebook(
                'Message via Facebook',
                null,
                'http://bible.soulsurvivor.com/node/' + $scope.nid,
                function() {console.log('share ok')},
                function(errormsg){
                    //alert(errormsg)
                    $ionicPopup.show({
                        title: 'Facebook',
                        templateUrl: "templates/facebook_error.html",
                        subTitle: 'Looks like you haven\'t got the Facebook App installed',
                        buttons: [
                          { text: 'Close' },
                          {
                            text: '<b>Download</b>',
                            type: 'button-positive',
                            onTap: function() {
                                window.open('http://m.facebook.com/install', '_system');
                            }
                          }
                        ]
                    }).then(function (res) {
                        console.log('Thank you for not eating my delicious ice cream cone');
                    });
                }
            )
        };
    }])

    .controller('DaysCtrl', ['$scope', '$timeout', '$http', '$data', '$ionicLoading', '$rootScope', 'Utils', 'Day', function ($scope, $timeout, $http, $data, $ionicLoading, $rootScope, Utils, Day) {
        $scope.days = [];
    
        var dayDB = Day.query;
        
        $scope.months = [];
        $scope.dbIsEmpty = true;
        
        $rootScope.notify();
        
        $scope.clearMonths = function () {
            var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

            for (var i=0; i<12; i++) {
                $scope.months [i] = {
                    name: monthNames[12 - i],
                    items: []
                };
            }
        };
        
        dayDB.onReady(function() {
            var storedData = dayDB.Days
            .filter(true)
            .orderByDescending("it.title")
            .toLiveArray();
            storedData.then(function (results) {
                if (results.length) { $scope.dbIsEmpty = false; }
                $scope.clearMonths();
                
                var i = 0,
                max = results.length;
                
                results.forEach(function (day) {
                    $scope.days.push({
                        'title' : day.title,
                        'day' : day.day,
                        'body' : day.body,
                        'created' : day.created,
                        'nid' : day.nid,
                        'read' : day.read,
                        'read_count' : day.read_count,
                        'comment_count' : day.comment_count,
                        'youtube' : day.youtube,
                        'subtitle' : day.subtitle,
                    });
                    
                    // Attach day to month array.
                    var month = new Date(day.created * 1000).getMonth(); 
                    $scope.months[12 - month].items.push(day);
                    
                    if (i == max - 1) {
                        // Last iteration
                        $rootScope.hide();
                    }
                    i++;
                });

            });
        });
        
        // Sets the active group and unsets the inactive group
        $scope.toggleGroup = function (group) {
            if ($scope.isGroupShown(group)) {
                $rootScope.shownGroup = null;
            } else {
                $rootScope.shownGroup = group;
            }
        };
        
        // Helper callback to check if a group is active or not.
        $scope.isGroupShown = function(group) {
            if ($rootScope.shownGroup == null) {
                return false;
            }
            return $rootScope.shownGroup.name === group.name;
        };
        
        $scope.hasChildren = function(group) {
            return group.items.length;
        };
                
        $scope.doRefresh = function () {
            if (!$rootScope.checkNetwork()) {
                $rootScope.notify("You are not connected to the internet...");
                $scope.$broadcast('scroll.refreshComplete');
            }
            else {
                console.log('Refreshing!');
                var uid = JSON.parse(window.localStorage.getItem('user_uid'));
            
                if (!!uid) {
                    var URL = 'http://bible.soulsurvivor.com/rest/views/days/' + uid;
                }
                else {
                    var URL = 'http://bible.soulsurvivor.com/rest/views/days';
                }
                
                
                $http({method: 'GET', url: URL}).
                //$http({method: 'GET', url: 'http://soulsurvivor.bible/rest/views/days'}).
                success(function(data, status, headers, config) {
                    var days = [];

                    if (data.length) { $scope.dbIsEmpty = false; }

                    var i = 0,
                        max = data.length;

                    data.forEach(function (data) {
                        var day = [];
                        day.day = data.node.field_day_number
                        day.body = data.node.body;
                        day.title = data.node.title;
                        day.created = data.node.date;
                        day.nid = data.node.nid;
                        day.read = JSON.parse(data.node.read);
                        day.read_count = data.node.read_count;
                        day.comment_count = data.node.comment_count;
                        day.youtube = data.node.youtube;
                        day.subtitle = data.node.subtitle;

                        days.push(day);

                        var dayTestDB = new DayDatabase({
                            provider: 'sqLite' , databaseName: 'MyDayDatabase'
                        });

                        dayTestDB.onReady(function() {
                            $scope.clearMonths();
                            var existingTasks = dayTestDB.Days.filter("nid", "==", day.nid).toLiveArray();
                            existingTasks.then(function(results) {
                                var todo = dayTestDB.Days.attachOrGet(day);
                                todo = day;

                                if (results.length == 0) {
                                    //create
                                    dayTestDB.Days.add(day);
                                }
                                dayTestDB.saveChanges();
                                var month = new Date(day.created * 1000).getMonth(); 
                                $scope.months[12 - month].items.push(day);
                            });
                        });

                        if (i == max - 1) {
                            // Last iteration
                            $rootScope.hide();
                            // Stop the refresher spinning.
                            $scope.$broadcast('scroll.refreshComplete');
                        }
                        i++;
                    });
                }).
                error(function(data, status, headers, config) {
                    console.log(status);
                    $scope.$broadcast('scroll.refreshComplete');
                    $rootScope.notify('Opps! It seems like something went wrong.');
                });
            }
        };

    }])


    /*.controller('RecentCtrl', ['$scope', '$timeout', '$http', '$data', 'Day', function ($scope, $timeout, $http, $data, Day) {
        
        $scope.stored = [];
        
        $data.Entity.extend("Days", {
            title: {type: String, required: true, maxLength: 200 },
            day: { type: "int" },
            nid: { type: "int", key: true, computed: true },
            created: { type: String }
        });

		$data.EntityContext.extend("DayDatabase", {
   			Days: { type: $data.EntitySet, elementType: Days }
		});
        
        var dayDB = new DayDatabase({
            provider: 'sqLite' , databaseName: 'MyDayDatabase'
        });
        
        dayDB.onReady(function() {
            var storedData = dayDB.Days.filter(true).toLiveArray();
            storedData.then(function (results) {
                results.forEach(function (day) {
                    $scope.stored.push({
                        'title' : day.title,
                        'day' : day.day,
                        'created' : day.created,
                        'nid' : day.nid,
                    });
                });
            });
        });
            
        $scope.doRefresh = function () {
            console.log('Refreshing!');
            $timeout( function() {
                $http({method: 'GET', url: 'http://bible.soulsurvivor.com/rest/views/days'}).
                success(function(data, status, headers, config) {
                    var days = [];
                    data.forEach(function (data) {
                        var day = [];
                        day.day = data.field_day_number[0].value;
                        day.body = data.body[0].value;
                        day.title = data.title[0].value;
                        day.created = data.created[0].value;
                        day.nid = data.nid[0].value;

                        days.push(day);

                        var dayTestDB = new DayDatabase({
                            provider: 'sqLite' , databaseName: 'MyDayDatabase'
                        });

                        dayTestDB.onReady(function() {
                            var existingTasks = dayTestDB.Days.filter("nid", "==", day.nid).toLiveArray();
                            existingTasks.then(function(results) {
                                var todo = dayTestDB.Days.attachOrGet(day);
                                todo = day;

                                if (results.length == 0) {
                                    //create
                                    dayTestDB.Days.add(day);
                                }
                                dayTestDB.saveChanges();
                            });
                        });
                    });
                }).
                error(function(data, status, headers, config) {
                    console.log(status);
                });

                //Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');

            }, 1000);
        };
    }])*/