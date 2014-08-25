'use strict';

(function () {

    angular.module('bioy.memoryServices', ['jaydata', 'bioy.services'])
        .factory('Day', ['$state', '$data', '$rootScope', '$http', '$q', 'Utils', function ($state, $data, $rootScope, $http, $q, Utils) {

            var dayOne = {
                title: 'The Year Begins',
                day: 1,
                youtubeOT: 'Rgh3g5EiWmg',
                youtubeNT: 'Rgh3g5EiWmg',
                verseBooks: 'Genesis, Matthew, Psalms',
                verseOT: 'Genesis 1:1 - 2:17',
                verseNT: 'Matthew 1:1-25',
                verseP: 'Psalms 1:1-6',
                subtitle: '',
                read: 0,
                read_count: 0,
                comment_count: 0,
                nid: 181,
                created: 1409575349,
                body: ''
            };
            
            $data.Entity.extend("Days", {
                title: {type: String, required: true, maxLength: 200 },
                day: { type: "int" },
                youtubeOT: { type: String },
                youtubeNT: { type: String },
                verseBooks: { type: String },
                verseOT: { type: String },
                verseNT: { type: String },
                verseP: { type: String },
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

            function doBackupDayOne () {
                var dayTestDB = new DayDatabase({
                    provider: 'sqLite' , databaseName: 'MyDayDatabase'
                });

                dayTestDB.onReady(function() {
                    dayTestDB.Days.add(dayOne);
                    dayTestDB.saveChanges();
                    dayOneDone = true;
                    doRefresh();
                });
            }

            var dayOneDone = false;

            function doBackupDayOneNoInternet () {
                var dayTestDB = new DayDatabase({
                    provider: 'sqLite' , databaseName: 'MyDayDatabase'
                });

                dayTestDB.onReady(function() {
                    dayTestDB.Days.add(dayOne);
                    dayTestDB.saveChanges();
                    doRefreshMenu();
                });
            }


            function doRefresh () {
                if (!$rootScope.checkNetwork()) {
                    console.log('no internet connection for refresh');
                    doBackupDayOneNoInternet();

                }
                else {

                    if (!dayOneDone) {
                        doBackupDayOne();
                        return;
                    }

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

                        // The first day that is come across that is read is the max read.
                        var maxRead = true;

                        data.forEach(function (data) {
                            var day = [];
                            var verses = data.node.bible_full.split(",");


                            day.day = data.node.field_day_number;
                            day.body = data.node.body;
                            day.title = data.node.title;
                            day.created = data.node.date;
                            day.nid = data.node.nid;
                            day.read = JSON.parse(data.node.read);
                            day.read_count = data.node.read_count;
                            day.comment_count = data.node.comment_count;
                            day.youtubeOT = data.node.youtubeOT;
                            day.youtubeNT = data.node.youtubeNT;
                            day.subtitle = data.node.subtitle;
                            day.verseBooks = data.node.bible_book;
                            day.verseOT = verses[0];
                            day.verseNT = verses[1];
                            day.verseP = verses[2];

                            if (maxRead && JSON.parse(data.node.read)) {
                                maxRead = false;
                                $rootScope.CurrentDay = data.node.field_day_number;
                                window.localStorage.setItem('currentDay', data.node.field_day_number);
                            }

                            days.push(day);

                            var dayTestDB = new DayDatabase({
                                provider: 'sqLite' , databaseName: 'MyDayDatabase'
                            });

                            dayTestDB.onReady(function() {
                                //$scope.clearMonths();
                                var existingDays = dayTestDB.Days.filter("nid", "==", day.nid).toLiveArray();
                                existingDays.then(function(results) {
                                    var todo = dayTestDB.Days.attachOrGet(day);
                                    todo.youtubeNT = day.youtubeNT;
                                    todo.youtubeOT = day.youtubeOT;
                                    todo.verseBooks = day.verseBooks;
                                    todo.verseOT = day.verseOT;
                                    todo.verseNT = day.verseNT;
                                    todo.verseP = day.verseP;
                                    todo.read_count = day.read_count;
                                    if (day.read) {
                                        todo.read = day.read;
                                    }
                                    todo.comment_count = day.comment_count;

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
                    dayDB.onReady(function() {
                        var storedData = dayDB.Days
                            .orderBy("it.created")
                            .toLiveArray();
                        storedData.then(function (results) {

                            if (results.length == 0) {
                                doRefreshMenu();
                                return;
                            }

                            var dayNo = 5;

                            if (results.length < 6) {
                                dayNo = results.length;
                            }

                            var i = 0,
                                menuDays = [];

                            while (i < dayNo) {
                                var day = results[i];
                                menuDays.push({
                                    'title': day.title,
                                    'day': day.day,
                                    'body': day.body,
                                    'created': day.created,
                                    'nid': day.nid,
                                    'read': day.read,
                                    'read_count': day.read_count,
                                    'verseBooks': day.verseBooks,
                                    'verseOT': day.verseOT,
                                    'verseNT': day.verseNT,
                                    'verseP': day.verseP,
                                    'youtubeOT': day.youtubeOT,
                                    'youtubeNT': day.youtubeNT,
                                    'subtitle': day.subtitle
                                });
                                i++;
                            }

                            $q.all(menuDays).then(function (days) {
                                $rootScope.showLoading = false;
                                $rootScope.menuDays = days;
                            })
                        });
                    });
                    return;
                }

                var read = parseInt($rootScope.CurrentDay);

                dayDB.onReady(function() {
                    var storedData = dayDB.Days
                        .filter("it.day >= " + (read - 1))
                        .filter("it.day < " + (read + 4))
                        .orderByDescending("it.created")
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
                                'verseBooks': day.verseBooks,
                                'verseOT': day.verseOT,
                                'verseNT': day.verseNT,
                                'verseP': day.verseP,
                                'youtubeOT' : day.youtubeOT,
                                'youtubeNT' : day.youtubeNT,
                                'subtitle' : day.subtitle
                            });

                            if (i == max - 1) {
                                // Last iteration
                            }
                            i++;
                        });

                        $q.all(menuDays).then(function (days) {
                            $rootScope.showLoading = false;
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
                        .orderByDescending("it.created")
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
                        .orderBy("it.created")
                        //.orderBy("it.title")
                        .toLiveArray();
                    storedData.then(function (results) {
                        if (results.length == 0) {
                            console.log('Days are empty...')
                            $rootScope.hide();
                            $rootScope.hide();

                        }
                        else {
                            $rootScope.firstDayId = results[0].nid;
                            $rootScope.hide();
                            $state.go('app.day', {dayId: results[0].nid});
                        }
                    });
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