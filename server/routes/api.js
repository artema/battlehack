var express = require('express');
var router = express.Router();

var model = require('../model/profile');

//-----------------------------------------------
//    GET /api/profile
//-----------------------------------------------

router.get('/api/profile', function(req, res) {
  var profileId = 1;

  model.getProfile(profileId).then(function(profile) {
    res.json(profile);
    res.end();
  }, function(e) {
    res.status(500);
    res.end();
  });
});

//-----------------------------------------------
//    GET /api/trips
//-----------------------------------------------

router.get('/api/trips', function(req, res) {
  var profileId = 1;

  model.getTrips(profileId).then(function(trips) {
    res.json(trips);
    res.end();
  }, function(e) {
    res.status(500);
    res.end();
  });
});

module.exports = router;
