var express = require("express");
var router = express.Router();

var dbRestaurant = require('./queriesRestaurant');WWW
router.get('/api/restaurants', dbRestaurant.getAllRestaurants);
router.get('/api/restaurants/:name', dbRestaurant.getRestaurantByName);
router.post('/api/restaurants', dbRestaurant.createRestaurant);
router.put('/api/restaurants/:id', dbRestaurant.updateRestaurant);
router.delete('/api/restaurants/:id', dbRestaurant.removeRestaurant);

module.exports = router;
