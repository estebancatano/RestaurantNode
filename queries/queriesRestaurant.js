var promise = require('bluebird');

var options = {
	promiseLib: promise
};

var pgp = require('pg-promise')(options);
//NUESTRA BD TEST
var connectionString = 'postgres://ervocumi:b-Btk-9bg5tNtMU41eOnbstc8pd_J5No@elmer.db.elephantsql.com:5432/ervocumi';
//BD DE RESTAURANT
//var connectionString = 'postgres://bqnkffou:qkuC7uBLuCmnH8WAXYIXrYHeFrlSVjs5@elmer.db.elephantsql.com:5432/bqnkffou';
//BD del grupo
/*var cn = {
  host: '138.197.15.163',
  port: 5454,
  database: 'restaurant',
  user: 'postgres',
  password: '94cbd72b4e4133f3417a61adf9a418b1'
};*/
var db = pgp(connectionString);
//var db = pgp(cn);

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
  db.any('SELECT * FROM restaurant WHERE UPPER(name_restaurant) LIKE $1', '%'.concat(name.toUpperCase()).concat('%'))
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
  //db.any('SELECT res.id_restaurant, res.name_restaurant, res.address, res.score, res.phone FROM restaurant as res, city as ci WHERE ci.name = $1 and res.city = ci.city_id', cityName)
		db.any('SELECT fran.id_franchise,fran.name_franchise,fran.address,fran.phone,fran.latitude,fran.longitude,fran.open_time_week,'
      + 'fran.close_time_week, fran.open_time_weekend,fran.close_time_weekend,ci.id_city,ci.name_city FROM franchise as fran, city as ci '
      + 'WHERE UPPER(ci.name_city) LIKE $1 and fran.city = ci.id_city', '%'.concat(cityName.toUpperCase()).concat('%'))
		.then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

/*
************** Validar HU con PO
function getRestaurantByScore(req, res, next){
  var score = req.params.score;
  db.any('SELECT * FROM restaurant WHERE score >= $1 ORDER BY score ASC', score)
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}
*/

// Método que busca restaurante por tipo de cocina
// Retorna información del restaurante y los menús asociados a éste
function getRestaurantByFoodType(req, res, next){
  var foodType = req.params.foodType;
  //db.any('SELECT res.name, res.address, res.score, res.phone FROM restaurant as res, food_type as ft, food_type_restaurant as ftr WHERE ft.type=$1 AND ft.food_type_id=ftr.food_type AND ftr.restaurant=res.restaurant_id', foodType)
db.any('SELECT res.id_restaurant, res.name_restaurant, res.description, res.email, ft.id_food_type, ft.type ' 
  + 'FROM restaurant as res, food_type as ft, food_type_restaurant as ftr ' 
  + 'WHERE UPPER(ft.type) LIKE $1 AND ft.id_food_type=ftr.food_type AND ftr.restaurant=res.id_restaurant', 
  '%'.concat(foodType.toUpperCase()).concat('%'))
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
	//db.any('SELECT res.name, res.address, res.score, res.phone FROM restaurant as res, menu WHERE menu.price >= $1 AND menu.price <= $2 AND menu.restaurant=res.restaurant_id', [minValue,maxValue])
	db.any('SELECT res.id_restaurant, res.name_restaurant, res.description, res.email FROM restaurant as res, dish '
    + 'WHERE dish.price >= $1 AND dish.price <= $2 AND dish.restaurant=res.id_restaurant AND dish.type = 12', [minValue,maxValue])
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}


function getRestaurantsByCoordinates(req, res, next){
  var latitude = parseFloat(req.params.latitude);
  var longitude = parseFloat(req.params.longitude);
  console.log(latitude,longitude);
  /*
    Se utiliza La Formula de Haversine, 
    para calcular la distancia de un punto a otro por latitud y longitud
    por defecto trae los resstaurantes que esten a un kilometro a la redonda 
    se necesitaban 2 constantes que se quemaron en la query 
    6371 = valor de los kilometrops de la tierra 
    1 = numero de kiolometros a la redonda 
  */

   db.any('Select * FROM (SELECT res.* , ( 6371 * ACOS(COS( RADIANS($1)) * COS(RADIANS(res.latitude))*COS(RADIANS(res.longitude) - RADIANS($2)) + SIN( RADIANS($3) )* SIN(RADIANS( res.latitude ) ) )) AS distance FROM restaurant AS res ) as t where distance < 1 ORDER BY distance ASC', [latitude,longitude,latitude])
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
	//getRestaurantByScore: getRestaurantByScore,
	getRestaurantByFoodType: getRestaurantByFoodType,
	getRestaurantByPriceRange: getRestaurantByPriceRange,
  getRestaurantsByCoordinates: getRestaurantsByCoordinates
};
