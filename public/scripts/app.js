(function() {
  'use strict';

  var app = angular.module('BetterRoute', [
    'ngRoute',
    'ngResource',
    'BetterRoute.controllers',
    'BetterRoute.services'
  ]).
  config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(false);

    $routeProvider.when('/', { templateUrl: '/partials/home.html', controller: 'HomeCtrl' });
    $routeProvider.when('/trip/add', { templateUrl: '/partials/trip-add.html', controller: 'TripAddCtrl' });
    $routeProvider.when('/trip/:tripId', { templateUrl: '/partials/trip.html', controller: 'TripCtrl' });
    $routeProvider.when('/trip/:tripId/track/:trackId', { templateUrl: '/partials/track.html', controller: 'TrackCtrl' });
    $routeProvider.otherwise({redirectTo: '/'});
  }]);

})();
