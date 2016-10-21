var db = require("../config/database");

module.exports = {
	createReservation: function (req, res, next){
		var client = req.body.client;
		var table_restaurant = parseInt(req.body.table_restaurant);
		var reservation_date = req.body.reservation_date;
		var reservation_duration = parseInt(req.body.reservation_duration);
		var amount_people = parseInt(req.body.amount_people);
		console.log(req.body);
		console.log(client);
		console.log(table_restaurant);
		console.log(reservation_date);
		console.log(reservation_duration);
		console.log(amount_people);
	  	db.none('insert into reservation(client, table_restaurant, reservation_date, reservation_duration, amount_people)' +
	      'values($1, $2, $3, $4, $5)',
	    [client, table_restaurant, reservation_date, reservation_duration, amount_people])
	    .then(function () {
	      res.status(200)
	        .json({
	          	status: 'Exitoso',
	          	message: 'Insertado una reservación'
	        });
	    })
	    .catch(function (err) {
	      return next(err);
	    });
	},
	getTablesByRestaurant: function (req, res, next) {
	  var restaurant;
	  restaurant = req.params.idRestaurant;
	  db.any('select * from table_restaurant where restaurant = $1', restaurant)
	    .then(function (data) {
	      res.status(200)
	        .json(data);
	    })
	    .catch(function (err) {
	      return next(err);
	    });
	}

};