var express = require("express");
var router = express.Router();

var dbTable = require('../queries/queriesTable');
router.post('/reserve', dbTable.reserveTable);

module.exports = router;
