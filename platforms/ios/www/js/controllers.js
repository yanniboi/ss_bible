angular.module('bioy.controllers', [])

    .controller('AppCtrl', ['$scope', '$rootScope', '$state', '$ionicModal', function ($scope, $rootScope, $state, $ionicModal) {
        if ($scope.login == null) {
            $scope.login = false;
        }
        
        // Set up global variables
        $rootScope.isLoggedIn = JSON.parse(window.localStorage.getItem('user_login'));
        $rootScope.shownGroup = null;

        
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
        
        // Method to check for internet connection.
        $rootScope.checkNetwork = function () {
            //@TODO remove debug for production.
            if (typeof navigator.connection === 'undefined') {
                return true;
            }
            if (navigator.connection.type == Connection.NONE) {
                return false;
            }
            return true;
        };
        
    }])

    .controller('HomeCtrl', ['$state', '$scope', '$rootScope', 'Utils', function ($state, $scope, $rootScope, Utils) {
        //var isLoggedIn = JSON.parse(window.localStorage.getItem('user_login'));
        
        var isLoggedIn = $rootScope.isLoggedIn;
        
        if (isLoggedIn) {
            var username = window.localStorage.getItem('user_name');
            $scope.welcome = "Hello " + username + '...';
        }
        else {
            $scope.welcome = "Hello little ones...";
        }
        
        $scope.settings = function () {
            $state.go('app.settings');
        }
        
        $scope.showMessage = function () {
            var text = "Please enter valid credentials";
            $rootScope.notify(text);
        }

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
        }
        
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
        }
        
        // Opens login dialog
        $scope.doLogin = function() {
            $scope.loginModal.show();
        }
    }])

    /**
     * Login controller to handle user login.
     */
    .controller('LoginCtrl', ['$scope', '$rootScope', '$state', '$http', '$ionicPopup', 'Utils', function ($scope, $rootScope, $state, $http, $ionicPopup, Utils) {
        // If username already stored load the default.
        $scope.user = {
            username: window.localStorage.getItem('user_name'),
            password: null
        };
        
        // Create variable to be used for authentication feedback.
        $scope.message = "";
        
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
            var async = true
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
                    
                    $scope.message = "Login Successful!";
                    $rootScope.notify($scope.message);
                    $scope.loginModal.remove();
                    // Redirect to home page.
                    //$state.go('app.home');
                }
                else {
                    // Show error message to user.
                    $scope.message = "Your details are incorrect. Please try again.";
                    $rootScope.notify($scope.message);
                    $scope.user.password = null;
                    console.log('error with connection. status: '+ status);
                }
            }

            // Build the request object.
            $rootScope.notify("Logging in...");
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
    .controller('DayDetailCtrl', ['$scope', '$rootScope', '$stateParams', '$ionicPopup', '$http', 'Day', 'Utils', function ($scope, $rootScope, $stateParams, $ionicPopup, $http, Day, Utils) {
        // Get the data from the database
        var dayDB = Day.query
        $scope.instructions = "Click 'Mark as Read' to indicate you have seen this Video!";
        $scope.$watch('day.read', function() {
            if ($scope.day.read) {
                $scope.instructions = "Congratulations. You have watched this video.";
            }
            else {
                $scope.instructions = "Click 'Mark as Read' to indicate you have seen this Video!";
            }
        });
        
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
                        'read' : results[0].read,
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

                    dayTestDB.saveChanges();
                    
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
        }
        
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

                    dayTestDB.saveChanges();
                    
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
        }
        
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