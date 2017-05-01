var express = require('express');
var request = require('request');
var router = express.Router();
require('dotenv/config');

router.get('/:lat/:long', function(req, res, next) {
  request({
    uri: 'https://developers.zomato.com/api/v2.1/geocode?lat=' + req.params.lat + '&lon=' + req.params.long,
    headers: {'user-key':process.env.ZOMATO_API_KEY}
  }).pipe(res);
});

module.exports = router;
