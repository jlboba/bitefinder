// ================ DEPENDENCIES ===================
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var mongoDBURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bitefinder';
var session = require('express-session');


// ===============  MIDDLEWARE ======================
app.use(express.static('public'));
app.use(bodyParser.json());
server.use(session({
  secret: "ellenjerricasheilabitefinder",
  resave: false,
  saveUninitialized: false
}));

// ===============  MIDDLEWARE ======================
var usersController = require('./controllers/users.js');
app.use('/users', usersController);

// ================== DB CONNECTION =====================
mongoose.connect(mongoDBURI);
mongoose.connection.once('open', function(){
  console.log('Database Connection is open');
});
// ================== LISTENER =====================
app.listen(port, function(){
  console.log('listening...');
});
