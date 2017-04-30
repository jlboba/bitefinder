// ================ DEPENDENCIES ===================
var express = require('express');
var router = express.Router();
var User = require('../models/users.js');

// ===============  CREATE ROUTE ===================
router.post('/', function(req,res){
  User.create(req.body, function(err, newUser){
    res.json(newUser);
  });
});

// =============== PUT ROUTE =======================
router.put('/:id', function(req, res){
  User.findByIdAndUpdate(req.params.id, req.body, { new: true }, function(error, updatedUser){
    res.json(updatedUser)
  });
});

module.exports = router;
