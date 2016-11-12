var express = require("express");
var router = express.Router();

var dbTest = require('../queries/queriesTest');
router.get('/:table', dbTest.getTest);

module.exports = router;