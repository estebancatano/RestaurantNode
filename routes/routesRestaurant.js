var express = require("express");
var router = express.Router();

var dbRestaurant = require('../queries/queriesRestaurant');
router.get('/all', dbRestaurant.getAllRestaurants);
router.get('/byName/:name', dbRestaurant.getRestaurantByName);
router.get('/byRestaurant/:restaurant', dbRestaurant.getFranchiseByRestaurant)
router.get('/byCity/:cityName', dbRestaurant.getRestaurantByCity);
//router.get('/score/:score', dbRestaurant.getRestaurantByScore);
router.get('/byFoodType/:foodType',dbRestaurant.getRestaurantByFoodType);
router.get('/byPrice/:min/:max',dbRestaurant.getRestaurantByPriceRange);
router.get('/byCoordinates/:latitude/:longitude',dbRestaurant.getRestaurantsByCoordinates);

module.exports = router;
