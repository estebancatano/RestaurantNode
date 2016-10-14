var db = require("../config/database");


module.exports = {
	getAllRestaurants: function (req,res,next){
		db.any('select * from restaurant')
		.then(function(data){
			res.status(200)
				.json(data);
		}).catch(function (err){
			return next(err);
		});
	},

	getRestaurantByName: function (req, res, next) {
	  var name = req.params.name;
	  db.any('select * from restaurant where name = $1', name)
	    .then(function (data) {
	      res.status(200)
	        .json(data);
	    })
	    .catch(function (err) {
	      return next(err);
	    });
	}

};
