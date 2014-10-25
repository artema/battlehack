//server/model/profile.js

//-----------------------------------------------
//    Dependencies
//-----------------------------------------------

var when = require('when');

//------------------------------------------------------------------------
//
//  ProfileModel
//
//------------------------------------------------------------------------

var ProfileModel = function(store) {
  this._store = store;
};

//-----------------------------------------------
//    Properties
//-----------------------------------------------

Object.defineProperty(ProfileModel.prototype, 'isAuthenticated', {
  get: function() {
    return true;
  }
});

//-----------------------------------------------
//    Public methods
//-----------------------------------------------

ProfileModel.prototype.getProfile = function(id) {
  return this._store.getProfile(id);
};

ProfileModel.prototype.getTrips = function(id) {
  return this._store.getTrips(id);
};

//------------------------------------------------------------------------
//
//  LocalStore
//
//------------------------------------------------------------------------

var LocalStore = function() {
  this._profiles = {};
  this._trips = {};

  var trips = [
    {
      'id': '1',
      'name': 'home-work',
      'tracks': [
        {
          'id': '3',
          'name': 'via volguna st.',
          'points': [
            [55.625904, 37.5225741],
            [55.628935, 37.516552],
            [55.634905, 37.518004],
            [55.640703, 37.503488],
            [55.643186, 37.506771],
            [55.646328, 37.510928],
            [55.655099, 37.522595],
            [55.663476, 37.547531],
            [55.6787721, 37.5746941]
          ]
        },
        {
          'id': '1',
          'name': 'via profsouznaya',
          'points': [
            [55.625904, 37.5225741],
            [55.628935, 37.516552],
            [55.639730, 37.524405],
            [55.645195, 37.528257],
            [55.652823, 37.536094],
            [55.660800, 37.544656],
            [55.668368, 37.552783],
            [55.675516, 37.560444],
            [55.680758, 37.566162],
            [55.679784, 37.570690],
            [55.6787721, 37.5746941]
          ]
        },
        {
          'id': '2',
          'name': 'via sevastopolsy pr.',
          'points': [
            [55.625904, 37.5225741],
            [55.628928, 37.523928],
            [55.634921, 37.534092],
            [55.638854, 37.537804],
            [55.638184, 37.542696],
            [55.643464, 37.557596],
            [55.653698, 37.568089],
            [55.663237, 37.578330],
            [55.667370, 37.564109],
            [55.676289, 37.574322],
            [55.6787721, 37.5746941]
          ]
        }
      ]
    }
  ];

  this._profiles['1'] = {
    'id': '1',
    'name': 'First Last'
  };

  this._trips['1'] = trips;
};

LocalStore.prototype.getProfile = function(id) {
  if (this._profiles[id])
    return when(this._profiles[id]);

  return when.reject();
};

LocalStore.prototype.getTrips = function(profileId) {
  if (this._trips[profileId])
    return when(this._trips[profileId]);

  return when.reject();
};

//------------------------------------------------------------------------
//
//  RemoteStore
//
//------------------------------------------------------------------------

var RemoteStore = function() {

};

//-----------------------------------------------
//    Exports
//-----------------------------------------------

module.exports = new ProfileModel(new LocalStore());
