// ================ DEPENDENCIES ===================
var express = require('express');
var Review = require('../models/review.js');
var router = express.Router();


// ===============  CREATE ROUTE ====================
router.post('/', function(req,res){
  Review.create(req.body, function(err, newReview){
    res.json(newReview);
  });
});



module.exports = router;
