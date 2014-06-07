angular.module('bioy.controllers', [])

    .controller('AppCtrl', function ($scope) {
    })

    .controller('DayDetailCtrl', ['$scope', '$stateParams', 'Day', function ($scope, $stateParams, Day) {
        //$scope.day = Day.get({dayId: $routeParams.dayId});
        var day = [],
            data = Day.get({dayId: $stateParams.dayId});

        day.title = data.title[0].value;
        day.dayId = data.field_day_number[0].value;
        day.body = data.body[0].value;
        day.nid = data.nid[0].value;

        $scope.day = day;

    }])

    .controller('DaysCtrl', ['$scope', 'Day', function ($scope, Day) {
        var days = Day.query();
        $scope.months = [];

        var monthNames = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ];
        
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
    }])
