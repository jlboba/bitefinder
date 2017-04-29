var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: {type:String, required:true},
  password: {type:String, required:true},
  favorites: [String]
});

module.exports = mongoose.model('User', userSchema);
