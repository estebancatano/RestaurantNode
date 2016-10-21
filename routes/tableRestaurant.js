var express = require("express");
var router = express.Router();

var dbTableRestaurant = require('../models/TableRestaurant');
router.route('/')
	.post(dbTableRestaurant.createTableRestaurant);

router.route('/:idRestaurant')
	.get(dbTableRestaurant.getTablesByRestaurant);

module.exports = router;