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

Object.defineProperty(ProfileModel.prototype, 'profile', {
  get: function() {
    var routes = [
      {
        'id': '1',
        'points': [
          [ 1.1, 2.2 ],
          [ 3.3, 4.4 ]
        ]
      },
      {
        'id': '2',
        'points': [
          [ 5.1, 6.2 ],
          [ 7.3, 7.4 ]
        ]
      }
    ];

    return {
      'id': '1',
      'name': 'First Last',
      'routes': routes
    };
  }
});

//-----------------------------------------------
//    Public methods
//-----------------------------------------------

ProfileModel.prototype.getProfile = function(id) {
  return this._store.getProfile(id);
};

//------------------------------------------------------------------------
//
//  LocalStore
//
//------------------------------------------------------------------------

var LocalStore = function() {
  this._profiles = {};
};

LocalStore.prototype.getProfile = function(id) {
  if (this._profiles[id])
    return when(this._profiles[id]);

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
