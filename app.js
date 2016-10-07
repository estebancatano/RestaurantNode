var express = require("express");
var bodyParser = require('body-parser');
var routes = require('./routes');

var app = express();

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function() {
	console.log('Puerto ' + app.get('port') + ' escuchando');
});

app.use(bodyParser.urlencoded({extended: true}));
app.use('/', routes);

module.exports = app;