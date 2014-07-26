'use strict';

(function () {

    angular.module('bioy.memoryServices', ['jaydata'])
        .factory('Day', ['$data', function ($data) {
            
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
            
            return {
                query: dayDB
            }
        }]);


}());