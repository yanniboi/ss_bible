angular.module('bioy.controllers', [])

.controller('AppCtrl', function($scope) {
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
    $scope.days = Day.query();
}])
