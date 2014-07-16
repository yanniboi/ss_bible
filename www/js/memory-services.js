'use strict';

(function () {

    var days = [
        {"nid":[{"value":"4"}],"uuid":[{"value":"53e442f8-972d-4aff-a100-c43b986c6241"}],"vid":[{"value":"4"}],"type":[{"target_id":"day"}],"langcode":[{"value":"en"}],"title":[{"value":"Day 217, 5th April: 1 Chronicles, 1 Corinthians and Psalms"}],"uid":[{"target_id":"1"}],"status":[{"value":"1"}],"created":[{"value":"1401139851"}],"changed":[{"value":"1401714183"}],"promote":[{"value":"1"}],"sticky":[{"value":"0"}],"revision_timestamp":[{"value":"0"}],"revision_uid":[{"target_id":"0"}],"log":[{"value":""}],"path":[{"alias":null,"pid":null}],"body":[{"value":"<p>By Mike Pilavachi<\/p>\r\n","format":"basic_html","summary":""}],"field_day_number":[{"value":"217","format":null}],"field_video":[{"target_id":"1","display":"1","description":""}],"field_youtube_id":[{"value":"pQg0wWMYnr0","format":null}],"month":[{"value":"April"}]},
        {"nid":[{"value":"3"}],"uuid":[{"value":"8b4921c3-c002-4b8a-942b-430e923edc2e"}],"vid":[{"value":"3"}],"type":[{"target_id":"day"}],"langcode":[{"value":"en"}],"title":[{"value":"Day 213, 1st May: 1 Chronicles, Romans and Psalms"}],"uid":[{"target_id":"1"}],"status":[{"value":"1"}],"created":[{"value":"1401139768"}],"changed":[{"value":"1401714172"}],"promote":[{"value":"1"}],"sticky":[{"value":"0"}],"revision_timestamp":[{"value":"0"}],"revision_uid":[{"target_id":"0"}],"log":[{"value":""}],"path":[{"alias":null,"pid":null}],"body":[{"value":"<p>By Andy Croft<\/p>\r\n","format":"basic_html","summary":""}],"field_day_number":[{"value":"213","format":null}],"field_video":[{"target_id":"3","display":"1","description":""}],"field_youtube_id":[{"value":"MbO1WIJ6HLw","format":null}],"month":[{"value":"May"}]},
        {"nid":[{"value":"1"}],"uuid":[{"value":"2d9db026-801a-4c3c-a308-8cd46767295b"}],"vid":[{"value":"1"}],"type":[{"target_id":"day"}],"langcode":[{"value":"en"}],"title":[{"value":"Day 221, 9th April: 1 Chronicles, 1 Corinthians and Psalms"}],"uid":[{"target_id":"1"}],"status":[{"value":"1"}],"created":[{"value":"1401126280"}],"changed":[{"value":"1401714746"}],"promote":[{"value":"1"}],"sticky":[{"value":"0"}],"revision_timestamp":[{"value":"0"}],"revision_uid":[{"target_id":"0"}],"log":[{"value":""}],"path":[{"alias":null,"pid":null}],"body":[{"value":"<p>By Mike Pilavachi<\/p>\r\n","format":"basic_html","summary":""}],"field_day_number":[{"value":"221","format":null}],"field_video":[{"target_id":"2","display":"1","description":""}],"field_youtube_id":[{"value":"0hKjC8G_wBk","format":null}],"month":[{"value":"April"}]}
    ],

        findById = function (id) {
            var day = null,
                l = days.length,
                i;
            for (i = 0; i < l; i = i + 1) {
                if (parseInt(days[i].nid[0].value) === id) {
                    day = days[i];
                    break;
                }
            }
            return day;
        },

        findByDay = function (dayNum) {
            var results = days.filter(function (element) {
                return dayNum === element.field_day_number[0].value;
            });
            return results;
        };


    /*angular.module('bioy.memoryServices', ['jaydata'])
        .factory('Day', ['$data', function ($data) {
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
            
            return {
                query: function () {
                    dayDB.onReady(function() {
                        var storedData = dayDB.Days.filter(true).toLiveArray();
                        storedData.then(function (results) {
                            var days = [];
                            results.forEach(function (day) {
                                days.push({
                                    'title' : day.title,
                                    'day' : day.day,
                                    'created' : day.created,
                                    'nid' : day.nid,
                                });
                            });
                            return days;
                        });
                    });
                },
                get: function (day) {
                    return findById(parseInt(day.dayId));
                }
            }
        }]);*/

    angular.module('bioy.memoryServices', ['jaydata'])
        .factory('Day', ['$data', function ($data) {
            
            $data.Entity.extend("Days", {
                title: {type: String, required: true, maxLength: 200 },
                day: { type: "int" },
                youtube: { type: String },
                subtitle: { type: String },
                read: { type: "int" },
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
            
            /*dayDB.onReady(function() {
                var storedData = dayDB.Days.filter(true).toLiveArray();
                storedData.then(function (results) {
                    var days = [];
                    results.forEach(function (day) {
                        days.push({
                            'title' : day.title,
                            'day' : day.day,
                            'created' : day.created,
                            'nid' : day.nid,
                        });
                    });
                    var test = days;
                    var blah = '';
                });
            });*/
            
            
            return {
                query: dayDB,
                get: function (day) {
                    return findById(parseInt(day.nid));
                }
            }
        }]);


}());