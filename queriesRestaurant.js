var promise = require('bluebird');

var options = {
	promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://bqnkffou:qkuC7uBLuCmnH8WAXYIXrYHeFrlSVjs5@elmer.db.elephantsql.com:5432/bqnkffou';
var db = pgp(connectionString);

function getAllRestaurants(req,res,next){
	db.any('select * from restaurant')
		.then(function(data){
			res.status(200)
				.json(data);
		}).catch(function (err){
			return next(err);
		});
}

function getRestaurantByName(req, res, next) {
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

module.exports={
	getAllRestaurants: getAllRestaurants,
	getRestaurantByName: getRestaurantByName
};
