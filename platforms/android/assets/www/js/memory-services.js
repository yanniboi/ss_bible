'use strict';

(function () {

    angular.module('bioy.memoryServices', ['jaydata', 'bioy.services'])
        .factory('Day', ['$data', '$rootScope', '$http', 'Utils', function ($data, $rootScope, $http, Utils) {
            
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
                    }).
                    error(function(data, status, headers, config) {
                        console.log('Error getting ajax request from server, status: ' + status);
                    });
                }   
            }
            
            return {
                query: dayDB,
                refresh: function() {
                    console.log('refreshing db from server')
                    doRefresh();
                }
            }
        }]);
    
}());