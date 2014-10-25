var express = require('express');
var router = express.Router();

var model = require('../model/profile');

//-----------------------------------------------
//    GET /
//-----------------------------------------------

router.get('/', function(req, res) {
  if (!model.isAuthenticated) {
    res.redirect('/login');
    return;
  }

  res.render('index', {
    API_KEY: req.app.get('google-maps-api-key'),
    start: [ 55.628935, 37.516552 ]
  });
});

module.exports = router;
