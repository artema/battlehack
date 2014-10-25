
angular.module('BetterRoute.controllers', [])

.controller('HomeCtrl', ['$scope', '$timeout', '$location', 'ProfileService', function($scope, $timeout, $location, ProfileService) {
  ProfileService.getTrips.query().$promise.then(function(trips) {
    $scope.trips = [];

    for (var i = 0; i < trips.length; i++) {
      $scope.trips.push({
        id: trips[i].id,
        name: trips[i].name,
        time: null
      });

      var index = i;

      for (var j = 0; j < trips[i].tracks.length; j++) {
        getRoute(trips[i].tracks[j].points).then(function(route) {
          var newtime = getRouteTime(route);
          $timeout(function() {
            $scope.trips[index].time = parseInt(Math.min($scope.trips[index].time || 9007199254740992, newtime) / 60);
          });
        }, console.error);
      }
    }
  }, console.error);

  $scope.showTrip = function(tripId) {
    $location.path('/trip/' + tripId);
  };
}])

.controller('TripCtrl', ['$scope', '$timeout', '$location', '$routeParams', 'ProfileService', function($scope, $timeout, $location, $routeParams, ProfileService) {
  var tripId = $routeParams.tripId;

  ProfileService.getTrips.query().$promise.then(function(trips) {
    var trip = null;
    for (var i = 0; i < trips.length; i++) {
      if (trips[i].id == tripId) {
        trip = trips[i];
        break;
      }
    }

    if (!trip) {
      console.error('Trip not found: ' + tripId);
      $location.path('/');
      return;
    }

    $scope.trip = trip;
    $scope.tracks = [];

    var calculateNext = function(i) {
      if (i == trip.tracks.length) {
        return;
      }

      $timeout(function() {
        getRoute(trip.tracks[i].points).then(function(route) {
          var time = getRouteTime(route);
          $timeout(function() {
            $scope.tracks = $scope.tracks.concat([{
              id: trip.tracks[i].id,
              name: trip.tracks[i].name,
              time: parseInt(time / 60)
            }]);
            calculateNext(++i);
          });
        }, console.error);
      }, 300);
    };

    calculateNext(0);
  });

  $scope.showTrack = function(trackId) {
    $location.path('/trip/' + tripId + '/track/' + trackId);
  };
}])

.controller('TrackCtrl', ['$scope', '$timeout', '$location', '$routeParams', 'ProfileService', function($scope, $timeout, $location, $routeParams, ProfileService) {
  var tripId = $routeParams.tripId;
  var trackId = $routeParams.trackId;

  ProfileService.getTrips.query().$promise.then(function(trips) {
    var trip = null;
    for (var i = 0; i < trips.length; i++) {
      if (trips[i].id == tripId) {
        trip = trips[i];
        break;
      }
    }

    if (!trip) {
      console.error('Trip not found: ' + tripId);
      $location.path('/');
      return;
    }

    var track = null;
    for (var i = 0; i < trip.tracks.length; i++) {
      if (trip.tracks[i].id == trackId) {
        track = trip.tracks[i];
        break;
      }
    }

    $scope.track = track;

    var route = null;
    getRoute(track.points).then(function(r) {
      route = r;
      drawRoute(myMap, route);
    }, console.error);

    $scope.$on('$destroy', function() {
      myMap.geoObjects.remove(route);
    });
  });
}])
