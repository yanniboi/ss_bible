angular.module('bioy.controllers', [])

    .controller('AppCtrl', function ($scope) {
    })

    .controller('DayDetailCtrl', ['$scope', '$stateParams', '$ionicPopup', 'Day', function ($scope, $stateParams, $ionicPopup, Day) {
        //$scope.day = Day.get({dayId: $routeParams.dayId});
        var dayDB = Day.query,
            data = Day.get({nid: $stateParams.dayId});
        
        $scope.nid = $stateParams.dayId,
        $scope.day = [];
        $scope.offline = false;
        

        /*day.title = data.title[0].value;
        day.dayId = data.field_day_number[0].value;
        day.body = data.body[0].value;
        day.nid = data.nid[0].value;*/
        // An alert dialog
        $scope.showPopup = function (number) {
            var alertPopup = $ionicPopup.alert({
                title: 'Psalm 90:2,4 NIV! ' + number,
                templateUrl: "templates/verse.html"
            });
            alertPopup.then(function (res) {
                console.log('Thank you for not eating my delicious ice cream cone');
            });
        };
        
        $scope.showVideo = function (day) {
            var url = "http://bible.soulsurvivor.com/sites/default/files/" + day + ".mp4";
            var video = $scope.buildVideo(url);
            
            var vidEl = document.getElementById("streamed-video");
            vidEl.appendChild(video); 
        };
        
        $scope.showDownload = function (day) {
            var fileUrl = "file:///storage/emulated/0/" + day + ".mp4";
            //var fileUrl = "http://techslides.com/demos/sample-videos/small.mp4";
            var video = $scope.buildVideo(fileUrl);
            
            var vidEl = document.getElementById("downloaded-video");
            vidEl.appendChild(video);             
        }
        
        $scope.buildVideo = function (url) {
            //var fileUrl = "file:///storage/emulated/0/" + day + ".mp4";
            //var fileUrl = "http://techslides.com/demos/sample-videos/small.mp4";
        
            var vidVid = document.createElement("video");
            var sourceVid = document.createElement("source");
            vidVid.setAttribute("class", "video-js vjs-default-skin");
            vidVid.setAttribute("preload", "auto");
            vidVid.setAttribute("controls", "true");
            vidVid.setAttribute("poster", "img/preview.jpg");
            vidVid.setAttribute("data-setup", "{}");
            sourceVid.setAttribute("src", url);
            sourceVid.setAttribute("type", "video/mp4");
            vidVid.appendChild(sourceVid);
            
            return vidVid; 
        }
        
        // Decide which video to display.
        $scope.init = function () {
            if ($scope.offline) {
                // Show offline version.
                $scope.showDownload($scope.day.dayId);
            }
            else {
                // Show streamed version.
                $scope.showVideo($scope.day.dayId);
            }
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
                        'created' : results[0].created,
                        'nid' : results[0].nid,
                    };
                    $scope.init();
                    dayDB.saveChanges();
                }

            });
        });

        
        $scope.downloadVideo = function (day) {
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
                                //"http://techslides.com/demos/sample-videos/small.mp4",

                                fileSystem.root.toURL() + day + ".mp4",
                                function (theFile) {
                                    var progEl = document.getElementById('download-progress');

                                    progEl.innerHTML = "Download Finished";
                                    //$('#video-show').css("display", "block");
                                    //$('#video-download').css("display", "none");

                                    /*var db = window.openDatabase("readingdb", "0.1", "DatabaseForReadings", 1000);
                                    db.transaction(function (tx) {
                                    tx.executeSql(
                                    "UPDATE days SET download = 1 WHERE day = ? ;",
                                    [day.data],
                                    function (tx, results) {console.log("database download bool updated"); },
                                    function (tx, error) {console.log("database download bool failed! error - ") ;}
                                    );
                                    });*/
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
    }])

    .controller('DaysCtrl', ['$scope', '$timeout', '$http', '$data', 'Day', function ($scope, $timeout, $http, $data, Day) {
        $scope.days = [];
    
        var dayDB = Day.query;
        
        $scope.months = [];
        $scope.dbIsEmpty = true;

        
        $scope.clearMonths = function () {
            var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

            for (var i=0; i<12; i++) {
                $scope.months [i] = {
                    name: monthNames[i],
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
                    });
                    var month = new Date(day.created * 1000).getMonth(); 
                    $scope.months[month - 1].items.push(day);
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
                
         $scope.doRefresh = function () {
            console.log('Refreshing!');
            $timeout( function() {
                $http({method: 'GET', url: 'http://bible.soulsurvivor.com/rest/views/days'}).
                success(function(data, status, headers, config) {
                    var days = [];
                    
                    if (data.length) { $scope.dbIsEmpty = false; }
                    
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
                                $scope.months[month - 1].items.push(day);
                                //$scope.months[month - 1].items[day.nid] = day;
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