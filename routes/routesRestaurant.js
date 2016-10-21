var express = require("express");
var router = express.Router();

var dbRestaurant = require('../queries/queriesRestaurant');
router.get('/', dbRestaurant.getAllRestaurants);
router.get('/:name', dbRestaurant.getRestaurantByName);

module.exports = router;
