var express = require("express");
var router = express.Router();

var dbTable = require('../queries/queriesTable');
router.post('/reserve', dbTable.reserveTable);
router.get('/available/:franchise/:init/:end',dbTable.getTablesByRestaurant);

module.exports = router;
