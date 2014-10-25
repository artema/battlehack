var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index.html', { title: 'Express', API_KEY: req.app.get('google-maps-api-key') });
});

module.exports = router;
