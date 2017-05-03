// ================== DEPENDENCIES =====================
var express = require('express');
var Loc = require('../models/locations.js');
var User = require('../models/users.js');
var router = express.Router();

// ================== ACTION ROUTES ====================
router.post('/save', function(req, res){
  Loc.create(req.body, function(err, createdLocation){
    User.findById(createdLocation.user, function(err, foundUser){
      foundUser.savedLoc.push(createdLocation);
      foundUser.save(function(err, savedUser){
        res.json(savedUser);
      });
    });
  });
});

// ====================== EXPORTS ======================
module.exports = router;
