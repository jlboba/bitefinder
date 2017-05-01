// ================ DEPENDENCIES ===================
var express = require('express');
var bcrypt = require('bcrypt');
var User = require('../models/users.js');
var router = express.Router();

// ===============  CREATE ROUTE ===================
router.post('/', function(req,res){
  req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)); // encrypt the password
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

// =============== DELETE ROUTE =======================
router.delete('/:id', function(req, res){
  User.findByIdAndRemove(req.params.id, function(error, deletedUser){
    res.json(deletedUser);
  });
});

// =============== RETRIEVE USER =======================
router.get('/:id', function(req, res){
  User.findById(req.params.id, function(error, foundUser){
    res.json(foundUser);
  });
});

module.exports = router;