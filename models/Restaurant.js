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
		if(name == null || name == ''){
			res.status(400)
				.json({msg: 'nombre no definido'});
		}
	  db.any('select * from restaurant where name_restaurant = $1', name)
	    .then(function (data) {
	      res.status(200)
	        .json(data);
	    })
	    .catch(function (err) {
	      return next(err);
	    });
	},
	getRestaurantByCity: function (req, res, next){
  var cityName = req.params.cityName;
	if(cityName == null || cityName == ''){
		res.status(400)
			.json({msg: 'ciudad no definida'});
	}
  db.any('SELECT res.id_restaurant, res.name_restaurant, res.address, res.email, res.description, res.phone FROM restaurant as res, city as ci WHERE ci.name_city = $1 and res.city = ci.id_city', cityName)
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
	},

	// Método que busca restaurante por tipo de cocina
	// Retorna información del restaurante y los menús asociados a éste
	getRestaurantByFoodType: function (req, res, next){
	  var foodType = req.params.foodType;
		if(foodType == null || foodType == ''){
			res.status(400)
				.json({msg: 'tipo de comida no definida'});
		}
	  db.any('SELECT res.name_restaurant, res.address, res.email, res.description, res.phone FROM restaurant as res, food_type as ft, food_type_restaurant as ftr WHERE ft.type=$1 AND ft.id_food_type=ftr.food_type AND ftr.restaurant=res.id_restaurant', foodType)
	    .then(function (data) {
	      res.status(200)
	        .json(data);
	    })
	    .catch(function (err) {
	      return next(err);
	    });
	},

	getRestaurantByPriceRange: function (req, res, next){
	  var minValue = parseInt(req.params.min);
	  var maxValue = parseInt(req.params.max);
		if(minValue == null || minValue == ''){
			res.status(400)
				.json({msg: 'valor minimo no definido'});
		}
		if(maxValue == null || maxValue == ''){
			res.status(400)
				.json({msg: 'valor maximo no definido'});
		}
	  console.log(maxValue,minValue);
	    db.any('SELECT  res.name_restaurant, res.address, res.email, res.description, res.phone FROM restaurant as res, dish WHERE dish.price >= $1 AND dish.price <= $2 AND dish.restaurant=res.id_restaurant', [minValue,maxValue])
	    .then(function (data) {
	      res.status(200)
	        .json(data);
	    })
	    .catch(function (err) {
	      return next(err);
	    });
	},

	getLocationRestaurant: function (req, res, next){
		var restaurant = req.params.idRestaurant;
	  db.any('select res.latitude, res.longitude from restaurant as res where id_restaurant = $1', restaurant)
	    .then(function (data) {
	      res.status(200)
	        .json(data);
	    })
	    .catch(function (err) {
	      return next(err);
	    });
	},

	getRestaurantNearby: function(req, res, next){
		var latitude = parseFloat(req.params.latitude);
		var longitude = parseFloat(req.params.longitude);
		var radiusLatitude = 0.00353;
		var radiusLongitude = 0.008041;
	  db.any('select res.name_restaurant, res.address, res.email, res.description, res.phone from restaurant as res where res.latitude BETWEEN $1 AND $2 AND res.longitude BETWEEN $3 AND $4', [(latitude - radiusLatitude),(latitude + radiusLatitude), (longitude - radiusLongitude), (longitude + radiusLongitude)])
	    .then(function (data) {
	      res.status(200)
	        .json(data);
	    })
	    .catch(function (err) {
	      return next(err);
	    });
	}
};
