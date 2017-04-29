// ================ DEPENDENCIES ===================
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

// ===============  GET ROUTE ======================
app.use(express.static('public'));

// ================== LISTENER =====================
app.listen(port, function(){
  console.log('listening...');
});
