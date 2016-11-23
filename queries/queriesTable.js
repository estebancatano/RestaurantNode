var promise = require('bluebird');

var options = {
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
//NUESTRA TEST
var connectionString = 'postgres://ervocumi:b-Btk-9bg5tNtMU41eOnbstc8pd_J5No@elmer.db.elephantsql.com:5432/ervocumi';
//BD DE RESTAURANT
//var connectionString = 'postgres://bqnkffou:qkuC7uBLuCmnH8WAXYIXrYHeFrlSVjs5@elmer.db.elephantsql.com:5432/bqnkffou';
var db = pgp(connectionString);
/*var cn = {
  host: '138.197.15.163',
  port: 5454,
  database: 'restaurant',
  user: 'postgres',
  password: '94cbd72b4e4133f3417a61adf9a418b1'
};
var db = pgp(cn);*/


function reserveTable(req, res, next) {
    // Formato fecha: AAAA-MM-DD HH:MM
    var user_restaurant = parseInt(req.body.user_restaurant);
    var table_restaurant = parseInt(req.body.table_restaurant);
    var date_init = req.body.date_init;
    var date_end = req.body.date_end;
    var amount_people = parseInt(req.body.amount_people);
    var state = 0;
    validateClient(user_restaurant, function(client){
        console.log(client);
    }, res);
    validateTable(table_restaurant, amount_people, function(table){
        console.log(table);
    }, res);
    db.none('INSERT INTO reservation(user_restaurant, table_restaurant, date_init, date_end,amount_people,state)' +
      'VALUES($1, $2, TIMESTAMP $3, $4, $5, $6)',
      [user_restaurant, table_restaurant, date_init, date_end,amount_people,state])
    .then(function(reservation){
      res.status(200)
        .json({
          status: 'Exitoso',
          message: 'Realizada la reserva'
        });
    })
    .catch(function(error){
      res.status(400)
          .json({
            status: 'Error',
            message: 'Error al realzar la reserva'
          });
    });
}

function validateClient(client, func, res){
  db.one('SELECT * FROM user_restaurant WHERE user_restaurant.id_user = $1', client)
  .then(function(client){
    func(client);
  })
  .catch(function(err){
    res.status(400)
    .json({
      status: 'Error',
      message: 'Error al encontrar el cliente'
    });
  });
}

function validateTable(table, amount, func, res){
  db.one('SELECT * FROM table_restaurant as tr WHERE tr.id_table_restaurant = $1', table)
  .then(function(table){
    func(table);
  })
  .catch(function(err){
    res.status(400)
    .json({
      status: 'Error',
      message: 'Error al encontrar la mesa'
    });
  });
}

function getAvailableTablesByFranchise(req, res, next){
  var franchise = req.params.franchise;
  var date_init = req.params.init;
  var date_end = req.params.end;
  var capacity = req.params.capacity;
  console.log(franchise);
  if(date_init == 'undefined' || date_init == null){
    res.status(500)
      .json({
        status: 'Error',
        message: 'Debe ingresar correctamente la fecha inicial'
      });
  }
  if(date_end == 'undefined' || date_end == null){
    res.status(500)
      .json({
        status: 'Error',
        message: 'Debe ingresar correctamente la fecha final'
      });
  }
  if(date_init >= date_end){
    res.status(500)
      .json({
        status: 'Error',
        message: 'La fecha final debe ser posterior a la fecha inicial'
      });
  }
//Faltan validaciones con la hora de cierre y apertura del restaurante
  db.any('SELECT tr.id_table_restaurant, tr.franchise, tr.capacity FROM table_restaurant AS tr LEFT OUTER JOIN reservation AS r ON (tr.id_table_restaurant = r.table_restaurant AND (r.date_end <= $2 OR r.date_init >= $3)) WHERE tr.available = true AND tr.franchise = $1 AND tr.capacity >= $4', [franchise, date_init, date_end, capacity])
    .then(function(data){
      res.status(200)
        .json(data);
    }).catch(function (err){
      return next(err);
    });
}

module.exports={
  reserveTable: reserveTable,
  getAvailableTablesByFranchise: getAvailableTablesByFranchise
};
