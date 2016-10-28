var express = require("express");
var router = express.Router();

var dbReservation = require('../models/Reservation');
router.route('/new')
	.post(dbReservation.createReservation);

module.exports = router;
