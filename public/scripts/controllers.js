
angular.module('BetterRoute.controllers', [])

.controller('HomeCtrl', ['$scope', '$timeout', '$location', 'ProfileService', function($scope, $timeout, $location, ProfileService) {
  ProfileService.getTrips.query().$promise.then(function(trips) {
    $scope.trips = [];

    var calculateNextOuter = function(i) {
      if (i == trips.length) {
        return;
      }

      $scope.trips.push({
        id: trips[i].id,
        name: trips[i].name,
        time: null
      });

      var calculateNext = function(index, trips, tracks) {
        if (index == tracks.length) {
          $timeout(function() {
            calculateNextOuter(++i);
          }, 300);
          return;
        }

        $timeout(function() {
          getRoute(tracks[index].points).then(function(route) {
            var time = getRouteTime(route);
            $timeout(function() {
              var newtime = getRouteTime(route);

              if (newtime > 0) {
                trips.time = parseInt(Math.min(trips.time || 9007199254740992, newtime / 60));
              }
              calculateNext(++index, trips, tracks);
            });
          }, console.error);
        }, 300);
      };

      calculateNext(0, $scope.trips[i], trips[i].tracks);
    };
    calculateNextOuter(0);
  }, console.error);

  $scope.showTrip = function(tripId) {
    $location.path('/trip/' + tripId);
  };

  $scope.createTrip = function() {
    $location.path('/trip/add');
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

  $scope.goBack = function() {
    $location.path('/');
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
      clearRoute(myMap, route);
    });

    $scope.goBack = function() {
      $location.path('/trip/' + tripId);
    };
  });
}])

.controller('TripAddCtrl', ['$scope', '$timeout', '$location', 'ProfileService', function($scope, $timeout, $location, ProfileService) {
  $scope.trip = {
    name: 'sasd',
    from: 'тверская 7',
    to: 'академика Капицы 22'
  };
  $scope.tracks = [];

  $scope.searchTrip = function() {
    $scope.searchComplete = false;

    if ($scope.route) {
      clearRoute(myMap, $scope.route);
      $scope.route = null;
    }

    searchRoute($scope.trip.from, $scope.trip.to).then(function(route) {
      drawRoute(myMap, route);
      route.editor.start();
      $timeout(function() {
        $scope.route = route;
        $scope.searchComplete = true;
      });
    }, console.error);
  };

  $scope.addTrip = function() {
    $scope.route.editor.stop();
    var via = $scope.route.getViaPoints();
    var main = $scope.route.getWayPoints();
    var points = [main.get(0).geometry.getCoordinates()];

    for (var i = 0; i < via.getLength(); i++) {
      points.push(via.get(i).geometry.getCoordinates());
    }

    points.push(main.get(1).geometry.getCoordinates());

    $scope.tracks = $scope.tracks.concat([{
      name: '',
      points: points
    }]);

    $scope.fillComplete = $scope.tracks.length > 1;
  };

  $scope.removeTrack = function(track) {
    $scope.tracks = $scope.tracks.filter(function(t){
      return t !== track;
    });

    $scope.fillComplete = $scope.tracks.length > 1;
  };

  $scope.saveTrip = function() {
    var request = {
      name: $scope.trip.name,
      tracks: $scope.tracks
    };

    ProfileService.addTrip.query(request).$promise.then(function(res) {
      $location.path('/trip/' + res.id);
    }, console.error);
  };

  $scope.$on('$destroy', function() {
    if ($scope.route) {
      clearRoute(myMap, $scope.route);
    }
  });
}]);
