var mongoose = require('mongoose');

var locationSchema = mongoose.Schema({
  name: String,
  id: String,
  user: String
});

module.exports = mongoose.model('Location', locationSchema);
