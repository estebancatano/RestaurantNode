var promise = require('bluebird');

var options = {
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
//NUESTRA TEST
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
var db = pgp(cn);


function reserveTable(req, res, next) {
    // Formato fecha: AAAA-MM-DD HH:MM
    var data = {
      user_restaurant : parseInt(req.body.user_restaurant),
      table_restaurant : parseInt(req.body.table_restaurant),
      date_init : req.body.date_init,
      date_end : req.body.date_end,
      amount_people : parseInt(req.body.amount_people),
      state : 0
    };

    validateClient(data, res);
}

function validateClient(data, res) {
  db.one('SELECT * FROM user_restaurant WHERE user_restaurant.id_user = $1', data.user_restaurant)
  .then(function(result) {
    validateTable(data, res)
  })
  .catch(function(err){
    res.status(400)
    .json({
      status: 'Error',
      message: 'Error al encontrar el cliente'
    });
  });
}

function validateTable(data, res) {
  //Valida que la mesa esté disponible en la franja horaria elegida
  db.none('SELECT res.id_reservation AS nreservations FROM reservation AS res WHERE res.table_restaurant = $1 AND (res.date_end > $2 AND res.date_init < $3)', [data.table_restaurant, data.date_init, data.date_end])
  .then(function(result) {
      validateCapacity(data, res);
  })
  .catch(function(err){
    res.status(500)
    .json({
        status: 'Error',
        message: 'La mesa seleccionada no se encuentra disponible en la franja horaria elegida'
    });
  });
}

function validateCapacity(data, res) {
  db.one('SELECT tr.capacity FROM table_restaurant as tr WHERE tr.id_table_restaurant = $1', data.table_restaurant)
  .then(function(table){
    if(table.capacity >= data.amount_people) {
      addReservation(data, res);
    } else {
      res.status(500)
      .json({
        status: 'Error',
        message: 'La mesa no tiene la capacidad para las personas elegidas'
      });
    }
  })
}


function addReservation(data, res) {
  //Función para agregar reserva
  db.none('INSERT INTO reservation(user_restaurant, table_restaurant, date_init, date_end, amount_people,state)' +
    'VALUES($1, $2, TIMESTAMP $3, $4, $5, $6)',
    [data.user_restaurant, data.table_restaurant, data.date_init, data.date_end, data.amount_people, data.state])
  .then(function(reservation){
    res.status(200)
      .json({
        status: 'Exitoso',
        message: 'Realizada la reserva'
      });
  })
  .catch(function(error){
    console.log(error);
    res.status(400)
        .json({
          status: 'Error',
          message: 'Error al realzar la reserva'
        });
  });
}

function getAvailableTablesByFranchise(req, res, next){
  var franchise = req.params.franchise;
  var date_init = req.params.init;
  var date_end = req.params.end;
  var capacity = req.params.capacity;
  /*var dow = new Date(date_init);
  if(dow > 0 && dow < 6) {
    var open_time = 'open_time_week';
    var close_time = 'close_time_week';
  } else {
    var open_time = 'open_time_weekend';
    var close_time = 'close_time_weekend';
  }*/
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
  //db.any('SELECT tr.id_table_restaurant, tr.franchise, tr.capacity FROM table_restaurant AS tr INNER JOIN reservation AS r ON (tr.id_table_restaurant = r.table_restaurant AND (r.date_end <= $2 OR r.date_init >= $3)) WHERE tr.available = true AND tr.franchise = $1 AND tr.capacity >= $4', [franchise, date_init, date_end, capacity])
  console.log(date_init);
  db.any('SELECT tr.id_table_restaurant, tr.franchise, tr.capacity FROM table_restaurant AS tr WHERE tr.available = true AND tr.franchise = $1 AND tr.capacity >= $4 AND tr.id_table_restaurant NOT IN(SELECT res.table_restaurant FROM reservation AS res WHERE $2 BETWEEN res.date_init AND res.date_end OR $3 BETWEEN res.date_init AND res.date_end)', [franchise, date_init, date_end, capacity])
    .then(function(data){
      //console.log(data);
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
