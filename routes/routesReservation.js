var express = require("express");
var router = express.Router();

var dbReservation = require('../queries/queriesReservation');
router.get('/changeReservation/:reservation/:franchise',dbReservation.changeReservationFranchise);

module.exports = router;