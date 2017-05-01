var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: {type:String, required:true},
  password: {type:String, required:true},
  name: {type: String},
  city: {type: String},
  favorites: [String],
  latitude: {type: String},
  longitude: {type: String}
});

module.exports = mongoose.model('User', userSchema);
