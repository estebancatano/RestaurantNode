var express = require("express");
var router = express.Router();

var dbDelivery = require('../queries/queriesDelivery');
router.put('/confirmation/:delivery', dbDelivery.confirmationDelivery);
router.put('/qualification/:delivery',dbDelivery.qualification);

module.exports = router;

