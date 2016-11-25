var promise = require('bluebird');

var options = {
	promiseLib: promise
};

var pgp = require('pg-promise')(options);

//var connectionString = 'postgres://ervocumi:b-Btk-9bg5tNtMU41eOnbstc8pd_J5No@elmer.db.elephantsql.com:5432/ervocumi';
//BD DE RESTAURANT
//var connectionString = 'postgres://bqnkffou:qkuC7uBLuCmnH8WAXYIXrYHeFrlSVjs5@elmer.db.elephantsql.com:5432/bqnkffou';
//var db = pgp(connectionString);

var cn = {
  host: '138.197.15.163',
  port: 5454,
  database: 'restaurant',
  user: 'postgres',
  password: '94cbd72b4e4133f3417a61adf9a418b1'
};
