var promise = require('bluebird');

var options = {
	promiseLib: promise
};

var pgp = require('pg-promise')(options);
//NUESTRA BD
var connectionString = 'postgres://ervocumi:b-Btk-9bg5tNtMU41eOnbstc8pd_J5No@elmer.db.elephantsql.com:5432/ervocumi';
//BD DE PRUEBA
//var connectionString = 'postgres://bqnkffou:qkuC7uBLuCmnH8WAXYIXrYHeFrlSVjs5@elmer.db.elephantsql.com:5432/bqnkffou';
var db = pgp(connectionString);

function getAllRestaurants(req,res,next){
	db.any('SELECT * FROM restaurant')
		.then(function(data){
			res.status(200)
				.json(data);
		}).catch(function (err){
			return next(err);
		});
}

function getRestaurantByName(req, res, next) {
  var name = req.params.name;
  db.any('SELECT * FROM restaurant WHERE name = $1', name)
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

function getRestaurantByCity(req, res, next){
  var cityName = req.params.cityName;
  db.any('SELECT res.restaurant_id, res.name, res.address, res.score, res.phone FROM restaurant as res, city as ci WHERE ci.name = $1 and res.city = ci.city_id', cityName)
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

function getRestaurantByScore(req, res, next){
  var score = req.params.score;
  db.any('SELECT * FROM restaurant WHERE score = $1', score)
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });

}

// Método que busca restaurante por tipo de cocina
// Retorna información del restaurante y los menús asociados a éste
function getRestaurantByFoodType(req, res, next){
  var foodType = req.params.foodType;
  db.any('SELECT res.name, res.address, res.score, res.phone FROM restaurant as res, food_type as ft, food_type_restaurant as ftr WHERE ft.type=$1 AND ft.food_type_id=ftr.food_type AND ftr.restaurant=res.restaurant_id', foodType)
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

function getRestaurantByPriceRange(req, res, next){
  var minValue = parseInt(req.params.min);
  var maxValue = parseInt(req.params.max);  
  console.log(maxValue,minValue);
    db.any('SELECT res.name, res.address, res.score, res.phone FROM restaurant as res, menu WHERE menu.price >= $1 AND menu.price <= $2 AND menu.restaurant=res.restaurant_id', [minValue,maxValue])
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
	getRestaurantByName: getRestaurantByName,
	getRestaurantByCity: getRestaurantByCity,
	getRestaurantByScore: getRestaurantByScore,
	getRestaurantByFoodType: getRestaurantByFoodType,
	getRestaurantByPriceRange: getRestaurantByPriceRange
};
