var express = require("express");
var router = express.Router();

var dbRestaurant = require('../queries/queriesRestaurant');
router.get('/', dbRestaurant.getAllRestaurants);
router.get('/:name', dbRestaurant.getRestaurantByName);
router.get('/city/:cityName', dbRestaurant.getRestaurantByCity);
//router.get('/score/:score', dbRestaurant.getRestaurantByScore);
router.get('/foodType/:foodType',dbRestaurant.getRestaurantByFoodType);
router.get('/byprices/:min/:max',dbRestaurant.getRestaurantByPriceRange);

module.exports = router;
