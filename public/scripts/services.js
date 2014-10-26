'use strict';

/* Services */

angular.module('BetterRoute.services', ['ngResource'])
  .factory('ProfileService', ['$resource', function($resource) {
    return {
      'getProfile': $resource('/api/profile', {}, { query: { method: 'GET', params: {} } }),
      'getTrips': $resource('/api/trips', {}, { query: { method: 'GET', params: {}, isArray:true } }),
      'addTrip': $resource('/api/trips', {}, { query: { method: 'PUT', params: {} } })
    };
  }]);
