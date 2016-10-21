var express = require("express");
var bodyParser = require('body-parser');
var routesRestaurant = require('./routes/routesRestaurant');
var routesTable = require('./routes/routesTable');

var app = express();

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function() {
	console.log('Puerto ' + app.get('port') + ' escuchando');
});

app.use(bodyParser.urlencoded({extended: true}));
app.use('/api/restaurants/', routesRestaurant);
app.use('/api/tables/',routesTable)

module.exports = app;