var express = require("express");
var router = express.Router();

var dbTableRestaurant = require('../models/TableRestaurant');
router.route('/new')
	.post(dbTableRestaurant.createTableRestaurant);

router.route('/all/:idRestaurant')
	.get(dbTableRestaurant.getTablesByRestaurant);

router.route('/availables/:idRestaurant')
	.get(dbTableRestaurant.getTablesAvailables);

module.exports = router;
