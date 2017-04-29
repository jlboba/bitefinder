// ================ DEPENDENCIES ===================
var express = require('express');
var router = express.Router();
var User = require('../models/users.js');

// ===============  CREATE ROUTE ======================
router.post('/', function(req,res){
  User.create(req.body, function(err, newUser){
    res.send(newUser);
  });
});

module.exports = router;
