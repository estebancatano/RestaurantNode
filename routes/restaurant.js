var express = require("express");
var router = express.Router();

var dbRestaurant = require('../models/Restaurant');
router.route('/')
  .get(dbRestaurant.getAllRestaurants);

router.route('/name/:name')
  .get(dbRestaurant.getRestaurantByName);

router.route('/city/:cityName')
  .get(dbRestaurant.getRestaurantByCity);

router.route('/foodType/:foodType')
  .get(dbRestaurant.getRestaurantByFoodType);

router.route('/priceRange/:min/:max')
  .get(dbRestaurant.getRestaurantByPriceRange);

router.route('/location/:idRestaurant')
  .get(dbRestaurant.getLocationRestaurant);

router.route('/nearby/:latitude/:longitude')
  .get(dbRestaurant.getRestaurantNearby);


module.exports = router;
