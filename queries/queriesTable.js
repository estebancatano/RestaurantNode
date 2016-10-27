var promise = require('bluebird');

var options = {
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://bqnkffou:qkuC7uBLuCmnH8WAXYIXrYHeFrlSVjs5@elmer.db.elephantsql.com:5432/bqnkffou';
var db = pgp(connectionString);

function reserveTable(req, res, next) {
  // Formato fecha: AAAA-MM-DD HH:MM
  var client = req.body.client;
  var table = parseInt(req.body.table);
  var date = req.body.date;
  var duration = parseInt(req.body.duration);
  var amount = parseInt(req.body.amount_people);
  db.none('INSERT INTO reservation(client, table_restaurant, reservation_date, reservation_duration,amount_people)' +
      'VALUES($1, $2, TIMESTAMP $3, $4, $5)',
    [client, table, date, duration,amount])
    .then(function () {
      res.status(200)
        .json({
          status: 'Exitoso',
          message: 'Realizada la reserva'
        });
    })
    .catch(function (err) {
      return next(err);
    });
};

module.exports={
  reserveTable: reserveTable
};