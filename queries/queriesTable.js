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

    validateOpenCloseTime(data, validateClient, res, 'table');
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
  data = {
    franchise : req.params.franchise,
    date_init : req.params.init,
    date_end : req.params.end,
    capacity : req.params.capacity,
    next : next
  }

  validateOpenCloseTime(data, getAvailableTables, res, 'franchise');
}

function getAvailableTables(data, res) {
  /*
  db.any('SELECT tr.id_table_restaurant, tr.franchise, tr.capacity FROM table_restaurant AS tr, franchise AS f ' +
        'WHERE tr.franchise = f.id_franchise AND tr.available = true AND tr.franchise = $1 AND tr.capacity >= $4 AND (TIME($2) NOT BETWEEN $5 AND $6 OR TIME($3) NOT BETWEEN $5 AND $6) AND tr.id_table_restaurant NOT IN(' +
        'SELECT res.table_restaurant FROM reservation AS res WHERE $2 BETWEEN res.date_init AND res.date_end OR $3 BETWEEN res.date_init AND res.date_end)',
  [data.franchise, data.date_init, data.date_end, data.capacity, closeOpenTimes.open_time, closeOpenTimes.close_time])*/
  db.any('SELECT tr.id_table_restaurant, tr.franchise, tr.capacity FROM table_restaurant AS tr ' +
        'WHERE tr.available = true AND tr.franchise = $1 AND tr.capacity >= $4 AND tr.id_table_restaurant NOT IN(' +
        'SELECT res.table_restaurant FROM reservation AS res WHERE $2 BETWEEN res.date_init AND res.date_end OR $3 BETWEEN res.date_init AND res.date_end)',
  [data.franchise, data.date_init, data.date_end, data.capacity])
    .then(function(data){
      res.status(200)
        .json(data);
    }).catch(function (err){
      return data.next(err);
    });
}

function validateTimes(data, func, res) {

  if(data.date_init == 'undefined' || data.date_init == null){
    res.status(500)
      .json({
        status: 'Error',
        message: 'Debe ingresar correctamente la fecha inicial'
      });
  } else if(data.date_end == 'undefined' || data.date_end == null){
    res.status(500)
      .json({
        status: 'Error',
        message: 'Debe ingresar correctamente la fecha final'
      });
  } else if(data.date_init >= data.date_end){
    res.status(500)
      .json({
        status: 'Error',
        message: 'La fecha final debe ser posterior a la fecha inicial'
      });
  } else {
    func(data, res);
  }
}

function validateOpenCloseTime(data, func, res, source) {
  var query = '';
  var param = '';

  if (source == 'franchise') {
    query = 'SELECT * FROM franchise WHERE id_franchise = $1'
    param = data.franchise;
    // Validar que la hora coincida con las horas de cierre y apertura del restaurante

  } else if (source = 'table') {
    query = 'SELECT DISTINCT open_time_week, close_time_week, open_time_weekend, close_time_weekend FROM franchise AS f, table_restaurant as tr WHERE f.id_franchise = $1'
    param = data.table_restaurant;
  }

  db.one(query, [param])
  .then(function(result) {
    var init = new Date(data.date_init);
    var end = new Date(data.date_end);
    dow = init.getDay();
    open_time = result.open_time_weekend,
    close_time = result.close_time_weekend
    if(dow > 0 && dow < 6) {
      open_time = result.open_time_week,
      close_time = result.close_time_week
    }
    hoursInit = init.getHours();
    minutesInit = init.getMinutes();
    hoursEnd = end.getHours();
    minutesEnd = end.getMinutes();
    hoursOpen = parseInt(open_time.substring(0,2));
    minutesOpen = parseInt(open_time.substring(3,5));
    hoursClose = parseInt(close_time.substring(0,2));
    minutesClose = parseInt(close_time.substring(3,5));

    console.log('Validando horario para cerrar y abrir');
    console.log(hoursInit);
    console.log(minutesInit);
    console.log(hoursEnd);
    console.log(minutesEnd);
    console.log(hoursClose);
    console.log(minutesClose);
    console.log(hoursOpen);
    console.log(minutesOpen);

    if (hoursInit > hoursClose || hoursInit < hoursOpen || hoursEnd > hoursClose || hoursEnd > hoursClose ||
       (hoursInit == hoursClose && minutesInit > minutesClose) ||
       (hoursInit == hoursOpen && minutesInit < minutesClose) ||
       (hoursEnd == hoursClose && minutesEnd > minutesClose) ||
       (hoursEnd == hoursClose && minutesEnd < minutesClose)) {
          res.status(500)
          .json({
            status: 'Error',
            message: 'El restaurante está cerrado en el horario especificado'
          });
    } else {
        validateTimes(data, func, res);
    }
  })
  .catch(function (err){
    console.log(err);
  });
}

module.exports={
  reserveTable: reserveTable,
  getAvailableTablesByFranchise: getAvailableTablesByFranchise
};
