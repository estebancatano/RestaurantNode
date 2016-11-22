var express = require("express");
var router = express.Router();

var dbMenuRestaurant = require('../queries/queriesMenuRestaurant');
router.get('/byDateRangeReservation/:restaurant/:date_init/:date_end', dbMenuRestaurant.getByDateRangeReservation);

module.exports = router;
