//Require dependencies
var express = require('express'),
  http = require('http'),
  parser = require('body-parser');

//create express instance
var app = express();

//Directory from which to render static files
app.use(express.static(__dirname + '/client'));

var port = process.env.PORT || 8000;

//Define the routes
routes = require('./routes')(app);

//Start up the server!
var server = http.createServer(app).listen(port, function() {
  console.log('Server listening on port ' + port);
});

//Export the app for use elsewhere
module.exports = app;