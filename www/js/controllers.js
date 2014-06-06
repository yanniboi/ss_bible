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
    day.videoUrl = "http://bible.soulsurvivor.com/sites/default/files/" + data.field_day_number[0].value + ".mp4";
    
    $scope.day = day;
    
}])

.controller('DaysCtrl', ['$scope', 'Day', function ($scope, Day) {
    $scope.days = Day.query();
}])

.controller('SearchCtrl', ['$scope', '$ionicScrollDelegate', 'filterFilter', 'Day', function($scope, $ionicScrollDelegate, filterFilter, Day) {
  var letters = $scope.letters = [];
  var contacts = $scope.contacts = [];
  var currentCharCode = 'A'.charCodeAt(0) - 1;
  var data = Day.query();

  //window.CONTACTS is defined below
  data
    .sort(function(a, b) {
      return a.field_day_number[0].value > b.field_day_number[0].value ? 1 : -1;
    })
    .forEach(function(person) {
      //Get the first letter of the last name, and if the last name changes
      //put the letter in the array
      var personCharCode = person.month[0].value.toUpperCase().charCodeAt(0);
      //We may jump two letters, be sure to put both in
      //(eg if we jump from Adam Bradley to Bob Doe, add both C and D)
      var difference = personCharCode - currentCharCode;
      for (var i = 1; i <= difference; i++) {
        addLetter(currentCharCode + i);
      }
      currentCharCode = personCharCode;
      contacts.push(person);
    });

  //If names ended before Z, add everything up to Z
  for (var i = currentCharCode + 1; i <= 'Z'.charCodeAt(0); i++) {
    addLetter(i);
  }

  function addLetter(code) {
    var letter = String.fromCharCode(code);
    contacts.push({
      isLetter: true,
      letter: letter
    });
    letters.push(letter);
  }

  //Letters are shorter, everything else is 52 pixels
  $scope.getItemHeight = function(item) {
    return item.isLetter ? 40 : 100;
  };
  $scope.getItemWidth = function(item) {
    return '100%';
  };

  $scope.scrollBottom = function() {
    $ionicScrollDelegate.scrollBottom(true);
  };

  var letterHasMatch = {};
  $scope.getContacts = function() {
    letterHasMatch = {};
    //Filter contacts by $scope.search.
    //Additionally, filter letters so that they only show if there
    //is one or more matching contact
    return contacts.filter(function(item) {
      var itemDoesMatch = !$scope.search || item.isLetter ||
        item.first_name.toLowerCase().indexOf($scope.search.toLowerCase()) > -1 ||
        item.last_name.toLowerCase().indexOf($scope.search.toLowerCase()) > -1;

      //Mark this person's last name letter as 'has a match'
      if (!item.isLetter && itemDoesMatch) {
        var letter = item.month[0].value.charAt(0).toUpperCase();
        letterHasMatch[letter] = true;
      }

      return itemDoesMatch;
    }).filter(function(item) {
      //Finally, re-filter all of the letters and take out ones that don't
      //have a match
      if (item.isLetter && !letterHasMatch[item.letter]) {
        return false;
      }
      return true;
    });
  };

    /*
    
    [{"id":1,"first_name":"Patrick","last_name":"Rogers","country":"Cyprus","ip_address":"153.88.89.148","email":"progers@yata.net"},
    
    */
    
    
    
  $scope.clearSearch = function() {
    $scope.search = '';
  };
}])