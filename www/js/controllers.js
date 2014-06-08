angular.module('bioy.controllers', [])

    .controller('AppCtrl', function ($scope) {
    })

    .controller('DayDetailCtrl', ['$scope', '$stateParams', '$ionicPopup', 'Day', function ($scope, $stateParams, $ionicPopup, Day) {
        //$scope.day = Day.get({dayId: $routeParams.dayId});
        var day = [],
            data = Day.get({dayId: $stateParams.dayId});

        day.title = data.title[0].value;
        day.dayId = data.field_day_number[0].value;
        day.body = data.body[0].value;
        day.nid = data.nid[0].value;

        $scope.day = day;
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
            //var  = document.getElementsByClassName('video-js');
            /*if (video[0].style.display === "none" || video[0].style.display === "") {
                video[0].style.display = "block";
            }
            else {
                video[0].style.display = "none";
            }
            videojs videoid="{{day.dayId}}" class="video-js vjs-default-skin vjs-controls-enabled vjs-has-started vjs-paused vjs-user-inactive" ng-model="video"*/
            
            //var url = "http://bible.soulsurvivor.com/sites/default/files/" + day + ".mp4";
            
            //var url = "file:///storage/emulated/0/" + day + ".mp4";
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

    .controller('DaysCtrl', ['$scope', '$timeout', '$http', 'Day', function ($scope, $timeout, $http, Day) {
        var days = Day.query();
        $scope.months = [];

        var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
        
        for (var i=0; i<12; i++) {
            $scope.months [i] = {
                name: monthNames[i],
                items: []
            };
        }

        days.forEach(function (day) {
            var month = new Date(day.created[0].value * 1000).getMonth();        
            $scope.months[month - 1].items.push(day);
        })
        
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
        $scope.days = days;

        /* temp*/
        $scope.stored = [Day.get({"dayId" : "1"})];
        
        var db = $data.define("Days", {
            title: String,
            day: Number,
            nid: Number,
            created: String
        });
        
        $scope.doRefresh = function () {
            console.log('Refreshing!');
            $timeout( function() {
                $http({method: 'GET', url: 'http://bible.soulsurvivor.com/rest/views/days'}).
                success(function(data, status, headers, config) {
                    var test = data;
                    data.forEach(function (day) {
                        var data = [];
                        data.day = day.field_day_number[0].value;
                        data.title = day.title[0].value;
                        data.created = day.created[0].value;
                        data.nid = day.nid[0].value;
                        db.save(data);
                        $scope.stored.push(day);
                    });
                }).
                error(function(data, status, headers, config) {
                    console.log(status);

                });

                /*$scope.stored.push(
                    Day.get({"dayId" : "3"})
                );*/
                

                //Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');

            }, 1000);
        };
    }])


    .controller('TodoCtrl', ['$scope', function ($scope) {
        $scope.todos = [];

        var Todo = $data.define("Todo", {
            task: String,
            done: Boolean
        });
        
        Todo.readAll().then(function (todos) {
            $scope.$apply(function () {
                $scope.todos = todos;
            });
        });
        
        $scope.remove = function (todo) {
            todo.remove()
                .then(function() {
                    $scope.$apply(function() {
                       var todos = $scope.todos;
                       todos.splice(todos.indexOf(todo), 1);
                    });
                })
               .fail(function(err) {
                   alert("Error deleting item");
               });
        }

        $scope.addNew = function (todo) {
            Todo.save(todo).then(function (todo) {
                $scope.$apply(function () {
                    $scope.newTodo = null;
                    $scope.todos.push(todo);
                });
            });
        };
    }])
