// ================ DEPENDENCIES ===================
var express = require('express');
var router = express.Router();
var User = require('../models/users.js');
var bcrypt = require('bcrypt');

// ===============  CREATE SESSION ROUTE (Login) ===================

router.post('/', function(req,res){
  User.findOne({username:req.body.username}, function(err, foundUser){
    if (bcrypt.compareSync(req.body.password,foundUser.password)){
      req.session.currentuser = foundUser;
      res.redirect('/');
    } else {
      res.send('username/password are not match')
    }
  });
});
