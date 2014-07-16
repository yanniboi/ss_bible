angular.module('bioy.controllers', [])

    .controller('AppCtrl', ['$scope', '$state', '$ionicModal', function ($scope, $state, $ionicModal) {
        if ($scope.login == null) {
            $scope.login = false;
        }
        
        // Check for login
        $scope.checkLogin = function () {
            console.log("checking login");
        };
        
        $scope.checkLogin();
        if (!$scope.login) {
            //$state.go('login');
        }
        
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
        
    }])

    .controller('HomeCtrl', ['$state', '$scope', function ($state, $scope) {
        $scope.settings = function () {
            $state.go('app.settings');
        }
    }])

    .controller('SettingsCtrl', ['$state', '$scope', 'localStorageService', function ($state, $scope, localStorageService) {
        /*if (window.localStorage.getItem('lightsabre') == null ||
            window.localStorage.getItem('download') == null) {
            
        }*/
        $scope.settings = {
            'lightsabre': window.localStorage.getItem('lightsabre'),
            'download': JSON.parse(window.localStorage.getItem('download'))
        };
        
        $scope.save = function () {
            window.localStorage.setItem('lightsabre', $scope.settings.lightsabre);
            window.localStorage.setItem('download', $scope.settings.download);
            $state.go('app.home');
            
            // You can also play with cookies the same way
            //localStorageService.cookie.add('localStorageKey','I am a cookie value now');
            
        }
        
        $scope.isLoggedIn = JSON.parse(window.localStorage.getItem('user_login'));
        
        $scope.doLogout = function() {
            window.localStorage.setItem('user_login', 0);
            window.localStorage.setItem('user_uid', 0);
            $scope.isLoggedIn = 0;
        }
        
        $scope.doLogin = function() {
            $scope.loginModal.show();
        }
    }])

    .controller('LoginCtrl', ['$scope', '$state', '$http', '$ionicPopup', 'AuthenticationService', function ($scope, $state, $http, $ionicPopup, AuthenticationService) {
        $scope.user = {
            username: window.localStorage.getItem('user_name'),
            password: null
        };
        
        /*$scope.login = function(user) {
            var auth = btoa(user.username+":"+user.password);
            $http.defaults.headers.common.Authorization = 'Basic ' + auth;
            $scope.login = true;
            $state.go('app.home');
        };*/
        
        $scope.message = "";
        
        $scope.login = function() {
            //AuthenticationService.login($scope.user);
            var test = $scope.user;
            window.localStorage.setItem('user_name', $scope.user.username);
            window.localStorage.setItem('user_password', $scope.user.password);
            
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
                if (status == 200) {
                   
                    var data =  JSON.parse(request.responseText); // Returned data, e.g., an HTML document.
                    
                    // Store user data
                    window.localStorage.setItem('user_uid', data.user.uid);
                    window.localStorage.setItem('user_login', 1);
                    
                    $scope.$apply(function () {
                        $scope.isLoggedIn = 0;
                    });
                    
                    var stop = '';
                    $scope.loginModal.remove();

                }
                else {
                    $scope.$apply(function () {
                        $scope.message = "Your details are incorrect. Please try again.";
                    });
                    //$scope.message = "Your details are incorrect. Please try again.";
                    $scope.user.password = null;
                    console.log('error with connection. status: '+ status);
                }
            }

            request.open(method, url, async);

            request.setRequestHeader("Content-Type", "application/json");
            request.setRequestHeader("Accept", "application/json");

            // Actually sends the request to the server.
            request.send(postData);            
        };

        /*$scope.$on('event:auth-loginRequired', function(e, rejection) {
            $scope.loginModal.show();
        });

        $scope.$on('event:auth-loginConfirmed', function() {
            $scope.username = null;
            $scope.password = null;
            $scope.loginModal.hide();
        });

        $scope.$on('event:auth-login-failed', function(e, status) {
            var error = "Login failed.";
            if (status == 401) {
                error = "Invalid Username or Password.";
            }
            $scope.message = error;
        });

        $scope.$on('event:auth-logout-complete', function() {
            $state.go('app.home', {}, {reload: true, inherit: false});
        }); */
        
    }])

    .controller('DayDetailCtrl', ['$scope', '$stateParams', '$ionicPopup', 'Day', function ($scope, $stateParams, $ionicPopup, Day) {
        //$scope.day = Day.get({dayId: $routeParams.dayId});
        var dayDB = Day.query,
            data = Day.get({nid: $stateParams.dayId});
        
        $scope.nid = $stateParams.dayId,
        $scope.day = [];
        $scope.offline = false;

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
        
        $scope.showVideo = function () {
            var url = "http://bible.soulsurvivor.com/sites/default/files/" + $scope.day.dayId + ".mp4";
            var video = $scope.buildVideo(url);
            
            var vidEl = document.getElementById("streamed-video");
            vidEl.appendChild(video); 
            
            var vidPrev = document.getElementById("video-preview");
            vidPrev.style.display = 'none';

        };
        
        $scope.showDownload = function () {
            var fileUrl = "file:///storage/emulated/0/" + $scope.day.dayId + ".mp4";
            var video = $scope.buildVideo(fileUrl);
            
            var vidEl = document.getElementById("downloaded-video");
            vidEl.appendChild(video); 
            
            var vidPrev = document.getElementById("video-preview");
            vidPrev.style.display = 'none';
        }
        
        $scope.buildVideo = function (url) {
        
            var vidVid = document.createElement("video");
            var sourceVid = document.createElement("source");
            vidVid.setAttribute("class", "video-js vjs-default-skin");
            vidVid.setAttribute("preload", "auto");
            vidVid.setAttribute("controls", "true");
            vidVid.setAttribute("autoplay", "true");
            vidVid.setAttribute("poster", "img/preview.jpg");
            vidVid.setAttribute("data-setup", "{}");
            sourceVid.setAttribute("src", url);
            sourceVid.setAttribute("type", "video/mp4");
            vidVid.appendChild(sourceVid);
            
            return vidVid; 
        }
        
        $scope.init = function () {
            var path = $scope.day.dayId + ".mp4";
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
                fileSystem.root.getFile(path, { create: false }, fileExists, fileDoesNotExist);
            }, getFSFail);
        }
        
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

                    
                    dayTestDB.saveChanges();
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

                    dayTestDB.saveChanges();
                });
            });
        }
        
        function fileExists(fileEntry){
            $scope.$apply(function () {
                $scope.offline = true;
            });
            $scope.startVideo($scope.day.dayId);
        }
        
        function fileDoesNotExist(){
            $scope.$apply(function () {
                $scope.offline = false;
            });
            $scope.startVideo($scope.day.dayId);

        }
        
        function getFSFail(evt) {
            console.log(evt.target.error.code);
        }
        
        $scope.startVideo = function (day) {
            // No longer doing video downloads.
            /*if ($scope.offline) {
                $scope.showDownload($scope.day.dayId);
            }
            else {
                $scope.showVideo($scope.day.dayId);
            }*/
            $scope.showYoutube();
        }
        
        $scope.showYoutube = function () {
            //var fileUrl = "file:///storage/emulated/0/" + $scope.day.dayId + ".mp4";
            var vidVid = document.createElement("iframe");
            vidVid.setAttribute("width", "auto");
            vidVid.setAttribute("height", "315");
            vidVid.setAttribute("src", "http://www.youtube.com/embed/" + $scope.day.youtube + "?modestbranding=1&rel=0&theme=light&color=white&autohide=0&disablekb=1");
            vidVid.setAttribute("frameborder", "0");
            vidVid.setAttribute("allowfullscreen", "true");
                        
            var vidEl = document.getElementById("downloaded-video");
            vidEl.appendChild(vidVid); 
            
            var vidPrev = document.getElementById("video-preview");
            vidPrev.style.display = 'none';
        }
        
        dayDB.onReady(function() {
            var test = $scope.nid;
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
                        'youtube' : results[0].youtube,
                        'subtitle' : results[0].subtitle,
                        'read' : results[0].read,
                    };
                    $scope.init();
                    dayDB.saveChanges();
                }

            });
        });
        
        $scope.downloadVideo = function () {
            var day = $scope.day.dayId;
            var progEl = document.getElementById('download-progress');


            progEl.innerHTML = "Download " + day + " Started";
            window.requestFileSystem(
                LocalFileSystem.PERSISTENT,
                0,
                function onFileSystemSuccess(fileSystem) {
                    fileSystem.root.getFile(
                        "dummy.html",
                        {create: true, exclusive: false},
                        function gotFileEntry(fileEntry) {
                            console.log("Full path:" + fileEntry.fullPath);
                            var sPath = fileEntry.fullPath.replace("dummy.html", "");
                            var fileTransfer = new FileTransfer();
                            fileEntry.remove();

                            var progEl = document.getElementById('download-progress');
                            progEl.innerHTML = "";

                            fileTransfer.onprogress = function (progressEvent) {
                                if (progressEvent.lengthComputable) {
                                    var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
                                    progEl.innerHTML = perc + "% Downloaded...";
                                } else {
                                    if (progEl.innerHTML === "") {
                                        progEl.innerHTML = "Downloading";
                                    } else {
                                        progEl.innerHTML.concat(".");
                                    }
                                }
                            };

                            fileTransfer.download(
                                "http://bible.soulsurvivor.com/sites/default/files/" + day + ".mp4",

                                fileSystem.root.toURL() + day + ".mp4",
                                function (theFile) {
                                    var progEl = document.getElementById('download-progress');
                                    progEl.innerHTML = "Download Finished";
                                    window.plugins.toast.showShortTop(
                                        'File downloaded!'
                                    );
                                    $scope.$apply(function () {
                                        $scope.offline = true;
                                    });
                                },
                                function (error) {
                                    console.log("download error source " + error.source);
                                    console.log("download error target " + error.target);
                                    console.log("upload error code: " + error.code);
                                }
                            );
                        },
                        function () {console.log("an error occured - 23")}
                    );
                },
                function () {console.log("an error occured - 24")}
            );
        };
        
        
        $scope.deleteVideo = function () {
            window.requestFileSystem(
                LocalFileSystem.PERSISTENT,
                0,
                function(fileSystem) {
                    var root = fileSystem.root;
                    
                    var remove_file = function(entry) {
                        entry.remove(function() {
                            window.plugins.toast.showShortTop(
                                'Local file deleted!'
                            );
                            $scope.$apply(function () {
                                $scope.offline = false;
                            });
                        }, function () {console.log("an error occured - 27")});
                    };

                    // retrieve a file and truncate it
                    root.getFile(
                        $scope.day.dayId + '.mp4',
                        {create: false},
                        remove_file,
                        function () {console.log("an error occured - 25")}
                    );
                },
                function () {console.log("an error occured - 26")}
            );
        };
        
        $scope.comment = function() {
            window.open('http://bible.soulsurvivor.com/node/' + $scope.nid + '#comment-form', '_blank', 'location=no');
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
                                window.open('http://m.facebook.com/install', '_blank', 'location=no');
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

    .controller('DaysCtrl', ['$scope', '$timeout', '$http', '$data', '$ionicLoading', 'Day', function ($scope, $timeout, $http, $data, $ionicLoading, Day) {
        $scope.days = [];
    
        var dayDB = Day.query;
        
        $scope.months = [];
        $scope.dbIsEmpty = true;

        /*get login box*/
        /*$http.get('https://customers')
            .success(function (data, status, headers, config) {
                console.log("Error occurred.  Status:" + status);
            })
            .error(function (data, status, headers, config) {
                console.log("Error occurred.  Status:" + status);
            });*/
        
        
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
            var storedData = dayDB.Days.filter(true).toLiveArray();
            storedData.then(function (results) {
                if (results.length) { $scope.dbIsEmpty = false; }
                $scope.clearMonths();
                results.forEach(function (day) {
                    $scope.days.push({
                        'title' : day.title,
                        'day' : day.day,
                        'body' : day.body,
                        'created' : day.created,
                        'nid' : day.nid,
                        'youtube' : day.youtube,
                        'subtitle' : day.subtitle,
                    });
                    var month = new Date(day.created * 1000).getMonth(); 
                    //var month = new Date(day.created).getMonth(); 
                    var test = $scope;
                    $scope.months[12 - month].items.push(day);
                });

            });
        });
        
        $scope.toggleGroup = function (group) {
            if ($scope.isGroupShown(group)) {
                $scope.shownGroup = null;
            } else {
                $scope.shownGroup = group;
            }
        };
        
        $scope.isGroupShown = function(group) {
            return $scope.shownGroup === group;
        };
        
        $scope.hasChildren = function(group) {
            return group.items.length;
        };
        
        $scope.show = function() {
            $scope.loading = $ionicLoading.show({
                template: 'Loading feed...'
            });
        };
        $scope.hide = function(){
            $scope.loading.hide();
        };
        
        var getReadData = function (uid) {
            $http({method: 'GET', url: 'http://bible.soulsurvivor.com/rest/views/read/' + uid}).
            //$http({method: 'GET', url: 'http://soulsurvivor.bible/rest/views/read/' + uid}).
            success(function(data, status, headers, config) {                    
                data.forEach(function (data) {
                    var day = [];

                    day.nid = data.node.nid;
                    day.read = data.node.read;


                    var dayTestDB = new DayDatabase({
                        provider: 'sqLite' , databaseName: 'MyDayDatabase'
                    });

                    dayTestDB.onReady(function() {
                        var existingTasks = dayTestDB.Days.filter("nid", "==", day.nid).toLiveArray();
                        existingTasks.then(function(results) {
                            var todo = dayTestDB.Days.attachOrGet(day);
                            todo.read = day.read;

                            /*if (results.length == 0) {
                                //create
                                dayTestDB.Days.add(day);
                            }*/
                            dayTestDB.saveChanges();
                        });
                    });
                });
            }).
            error(function(data, status, headers, config) {
                console.log(status);
            });
        }
                
         $scope.doRefresh = function () {
            console.log('Refreshing!');
             $scope.show();
            $timeout( function() {
                $http({method: 'GET', url: 'http://bible.soulsurvivor.com/rest/views/days'}).
                //$http({method: 'GET', url: 'http://soulsurvivor.bible/rest/views/days'}).
                success(function(data, status, headers, config) {
                    var days = [];
                    
                    if (data.length) { $scope.dbIsEmpty = false; }
                    
                    data.forEach(function (data) {
                        var day = [];
                        /*day.day = data.field_day_number[0].value;
                        day.body = data.body[0].value;
                        day.title = data.title[0].value;
                        day.created = data.created[0].value;
                        day.nid = data.nid[0].value;*/
                        day.day = data.node.field_day_number
                        day.body = data.node.body;
                        day.title = data.node.title;
                        day.created = data.node.date;
                        day.nid = data.node.nid;
                        day.read = data.node.read;
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
                                //$scope.months[month - 1].items[day.nid] = day;
                            });
                        });
                    });
                }).
                error(function(data, status, headers, config) {
                    console.log(status);
                });
                
                
                /*******************************************/
                
                var uid = JSON.parse(window.localStorage.getItem('user_uid'));
                if (uid) {
                    getReadData(uid);
                }
                
                
                //Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');

            }, 1000);
             $scope.hide();
        };

    }])


    .controller('RecentCtrl', ['$scope', '$timeout', '$http', '$data', 'Day', function ($scope, $timeout, $http, $data, Day) {
        
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
    }])