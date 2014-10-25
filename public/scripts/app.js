(function() {
  'use strict';

  var app = angular.module('BetterRoute', [
    'ngRoute',
    'BetterRoute.controllers'
  ]).
  config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(false);

    $routeProvider.when('/', {templateUrl: '/partials/home.html', controller: 'HomeCtrl'});
    $routeProvider.otherwise({redirectTo: '/'});
  }]);

})();
