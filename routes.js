var express = require("express");
var router = express.Router();

var dbRestaurant = require('./queriesRestaurant');
router.get('/api/restaurants', dbRestaurant.getAllRestaurants);
router.get('/api/restaurants/:name', dbRestaurant.getRestaurantByName);

module.exports = router;
