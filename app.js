var express = require("express");
var bodyParser = require('body-parser');
var routes = require('./routes');

var app = express();

app.listen(8080, function() {
	console.log('Puerto 8080 escuchando');
});

app.use(bodyParser.urlencoded({extended: true}));
app.use('/', routes);

module.exports = app;