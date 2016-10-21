var promise = require('bluebird');

var options = {
	promiseLib: promise
};

var pgp = require('pg-promise')(options);

var connectionString = 'postgres://tlwrqwoj:Xs08KXM_gGUQEbrW2BZ-4wdRUod52j6X@elmer.db.elephantsql.com:5432/tlwrqwoj';
//var connectionString = 'postgres://bqnkffou:qkuC7uBLuCmnH8WAXYIXrYHeFrlSVjs5@elmer.db.elephantsql.com:5432/bqnkffou';
var db = pgp(connectionString);

module.exports = db;