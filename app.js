var express = require("express");
var bodyParser = require('body-parser');
var routesRestaurant = require('./routes/routesRestaurant');
var routesTable = require('./routes/routesTable');
var routesTest = require('./routes/routesTest');
var routesDelivery = require('./routes/routesDelivery');
var routesMenuRestaurant = require('./routes/routesMenuRestaurant');
var routesReservation = require('./routes/routesReservation');

//var cors = require('cors');

var app = express();


app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function() {
	console.log('Puerto ' + app.get('port') + ' escuchando');
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use('/api/restaurants/', routesRestaurant);
app.use('/api/tables/',routesTable);
app.use('/api/test/',routesTest);
app.use('/api/delivery/',routesDelivery);
app.use('/api/menuRestaurant/',routesMenuRestaurant);
app.use('/api/reservation/',routesReservation);
//app.use(cors());

module.exports = app;
