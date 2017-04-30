// ================ DEPENDENCIES ===================
var express = require('express');
var router = express.Router();
var User = require('../models/users.js');
var bcrypt = require('bcrypt');

router.get('/', function(req, res){
  console.log('login');
})


// ===============  CREATE SESSION ROUTE (Login) ===================
router.post('/', function(req,res){
  User.findOne({username:req.body.username}, function(err, foundUser){
    if (bcrypt.compareSync(req.body.password,foundUser.password)){
      req.session.currentuser = foundUser;
      res.send('login successfully')
    } else {
      res.send('username/password are not match')
    }
  });
});

// ===============  DELETE SESSION ROUTE (Logout) ===================
router.delete('/', function(req,res){
  req.session.destroy(function(){
    res.send('logout successfully');
  });
});

module.exports = router;
