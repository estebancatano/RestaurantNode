var express = require("express");
var router = express.Router();

var dbReservation = require('../models/Reservation');
router.route('/')
	.post(dbReservation.createReservation);

module.exports = router;