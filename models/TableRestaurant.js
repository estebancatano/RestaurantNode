var db = require("../config/database");

module.exports = {
	createTableRestaurant: function (req, res, next){
		var restaurant = parseInt(req.body.restaurant);
		var capacity = parseInt(req.body.capacity);
		var available = req.body.available;
		console.log(req.body);
	  	db.none('insert into table_restaurant(restaurant, capacity, available)' +
	      'values($1, $2, $3)',
	    [restaurant, capacity, available])
	    .then(function () {
	      res.status(200)
	        .json({
	          	status: 'Exitoso',
	          	message: 'Insertado una mesa de restaurant'
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