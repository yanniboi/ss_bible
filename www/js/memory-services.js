'use strict';

(function () {

    angular.module('bioy.memoryServices', ['jaydata', 'bioy.services'])
        .factory('Day', ['$state', '$data', '$rootScope', '$http', '$q', 'Utils', function ($state, $data, $rootScope, $http, $q, Utils) {
            
            $data.Entity.extend("Days", {
                title: {type: String, required: true, maxLength: 200 },
                day: { type: "int" },
                youtube: { type: String },
                subtitle: { type: String },
                read: { type: "int" },
                read_count: { type: "int" },
                comment_count: { type: "int" },
                nid: { type: "int", key: true, computed: true },
                created: { type: String },
                body: { type: String }
            });

            $data.EntityContext.extend("DayDatabase", {
                Days: { type: $data.EntitySet, elementType: Days }
            }); 

            var dayDB = new DayDatabase({
                provider: 'sqLite' , databaseName: 'MyDayDatabase'
            });
            
            function doRefresh () {
                if (!$rootScope.checkNetwork()) {
                    console.log('no internet connection for refresh')
                }
                else {
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
                                //$scope.clearMonths();
                                var existingDays = dayTestDB.Days.filter("nid", "==", day.nid).toLiveArray();
                                existingDays.then(function(results) {
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
                        
                        $q.all(days).then(function () {
                            console.log('finished updating days!');
                            doRefreshMenu();
                        });
                        
                    }).
                    error(function(data, status, headers, config) {
                        console.log('Error getting ajax request from server, status: ' + status);
                    });
                }   
            }

            function doRefreshMenu () {
                var dayDB = new DayDatabase({
                    provider: 'sqLite' , databaseName: 'MyDayDatabase'
                });
                if ($rootScope.CurrentDay == null) {
                    var test = $rootScope.CurrentDay;
                    return;
                }

                var readtest = $rootScope.CurrentDay;
                var read = parseInt($rootScope.CurrentDay);
                //var read = 8;

                dayDB.onReady(function() {
                    var storedData = dayDB.Days
                        .filter("it.day >= " + (read - 1))
                        .filter("it.day < " + (read + 4))
                        .orderByDescending("it.title")
                        .toLiveArray();
                    storedData.then(function (results) {
                        if (results.length) { /* do something */ }

                        var i = 0,
                            max = results.length;

                        var menuDays = [];

                        results.forEach(function (day) {
                            menuDays.push({
                                'title' : day.title,
                                'day' : day.day,
                                'body' : day.body,
                                'created' : day.created,
                                'nid' : day.nid,
                                'read' : day.read,
                                'read_count' : day.read_count,
                                'comment_count' : day.comment_count,
                                'youtube' : day.youtube,
                                'subtitle' : day.subtitle
                            });

                            // Attach day to month array.


                            if (i == max - 1) {
                                // Last iteration
                                //$rootScope.hide();
                            }
                            i++;
                        });

                        $q.all(menuDays).then(function (days) {
                            var test = days;
                            $rootScope.menuDays = days;
                        })

                    });
                });
            }

            function getMaxDay () {
                var dayDB = new DayDatabase({
                    provider: 'sqLite' , databaseName: 'MyDayDatabase'
                });

                dayDB.onReady(function() {
                    var storedData = dayDB.Days
                        .orderByDescending("it.day")
                        .first (
                            function (day) { return day.read == 1 },
                            {},
                            function (result) {
                                var test1 = result.day;
                                $rootScope.CurrentDay = result.day;
                                window.localStorage.setItem('currentDay', result.day);
                                $rootScope.notify(result.day);
                            }

                        );
                });
            }

            function getFirstDay () {
                var dayDB = new DayDatabase({
                    provider: 'sqLite' , databaseName: 'MyDayDatabase'
                });

                dayDB.onReady(function() {
                    var storedData = dayDB.Days
                        //.orderBy("it.day")
                        .orderBy("it.title")
                        .first (
                        function (day) { return day.read == 0 },
                        {},
                        function (result) {
                            $rootScope.firstDayId = result.nid;
                            $rootScope.hide();
                            $state.go('app.day', {dayId: result.nid});
                        }

                    );
                });
            }

            return {
                query: dayDB,
                refresh: function() {
                    console.log('refreshing db from server');
                    doRefresh();
                },
                refreshMenu: function () {
                    console.log('refreshing menu');
                    doRefreshMenu();
                },
                getCurrentDay: function () {
                    console.log('getting max day');
                    getMaxDay();
                },
                getStartDay: function () {
                    $rootScope.show('Loading...');
                    console.log('getting start day');
                    getFirstDay();
                }
            }
        }]);
    
}());