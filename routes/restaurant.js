var express = require("express");
var router = express.Router();

var dbRestaurant = require('../models/Restaurant');
router.get('/', dbRestaurant.getAllRestaurants);
router.get('/:name', dbRestaurant.getRestaurantByName);

module.exports = router;